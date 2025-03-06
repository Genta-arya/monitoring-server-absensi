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
      setLogs((prevLogs) => [data, ...prevLogs]); // Tambah log terbaru di atas
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
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 rounded-md text-lg font-medium transition ${
            filter === "all" ? "bg-blue-500" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("info")}
          className={`px-5 py-2 rounded-md text-lg font-medium transition ${
            filter === "info" ? "bg-sky-500" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          Info
        </button>
        <button
          onClick={() => setFilter("error")}
          className={`px-5 py-2 rounded-md text-lg font-medium transition ${
            filter === "error" ? "bg-red-500" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          Error
        </button>
      </div>

      {/* Log List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {logs
          .filter((log) => filter === "all" || log.level === filter)
          .map((log, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-md border ${
                log.level === "info"
                  ? "bg-sky-900 border-sky-500"
                  : "bg-red-900 border-red-500"
              }`}
            >
              <p className="text-xs text-gray-300 font-mono">{log.timestamp}</p>
              <p className="text-lg font-bold">
                <span
                  className={`text-${log.level === "info" ? "sky" : "red"}-400`}
                >
                  [{log.level.toUpperCase()}]:
                </span>
                {log.message}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
