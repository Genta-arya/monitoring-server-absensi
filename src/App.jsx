import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://digital.apiservices.my.id/", {
  protocols: ["websocket"],
});

function App() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    socket.on("log", (data) => {
      setLogs((prevLogs) => {
        const newLogs = [data, ...prevLogs];
        return newLogs.slice(0, 10); // Hanya menyimpan 10 log terbaru
      });
    });

    return () => {
      socket.off("log");
    };
  }, []);

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📜 Monitoring Logger Absensi
      </h1>

      {/* Filter Buttons */}
      <div className="flex gap-4 justify-center mb-6">
        {["all", "info", "error"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-md text-lg font-medium transition ${
              filter === type ? "bg-blue-500" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Log List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {logs
          .filter((log) => filter === "all" || log.level === filter)
          .slice(0, 10) // Pastikan hanya 10 log terbaru yang ditampilkan
          .map((log, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-md border transition ${
                log.level === "info"
                  ? "bg-sky-900 border-sky-500 hover:bg-sky-800"
                  : "bg-red-900 border-red-500 hover:bg-red-800"
              }`}
            >
              <p className="text-xs text-gray-400 font-mono">{log.timestamp}</p>
              <p className="text-lg font-bold flex items-center gap-2">
                <span
                  className={`${
                    log.level === "info" ? "text-sky-400" : "text-red-400"
                  }`}
                >
                  [{log.level.toUpperCase()}]:
                </span>{" "}
                <p>{log.message}</p>
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
