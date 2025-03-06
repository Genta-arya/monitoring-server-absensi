import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

// Koneksi ke socket.io
const socket = io("http://localhost:8081", {
  transports: ["websocket"],
});

function App() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    socket.on("log", (data) => {
      setLogs((prevLogs) => {
        const newLogs = [data, ...prevLogs];
        return newLogs.slice(0, 30); // Hanya simpan 10 log terbaru
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
      <div className="flex gap-2 flex-wrap w-full justify-center mb-6">
        {["all", "info", "error", "query"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-md text-lg font-medium transition ${
              filter === type ? "bg-blue-500" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <p className="text-xs w-24">{type.toUpperCase()}</p>
          </button>
        ))}
      </div>

      {/* Log List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        <AnimatePresence>
          {logs
            .filter((log) => filter === "all" || log.level === filter)
            .slice(0, 10) // Pastikan hanya 10 log terbaru yang ditampilkan
            .map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }} // Animasi masuk
                animate={{ opacity: 1, y: 0 }} // Animasi tampil
                exit={{ opacity: 0, y: 10 }} // Animasi keluar
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg shadow-md border transition ${
                  log.level === "info"
                    ? "bg-sky-900 border-sky-500 hover:bg-sky-800"
                    : log.level === "query"
                    ? "bg-yellow-900 border-yellow-500 hover:bg-yellow-800"
                    : "bg-red-900 border-red-500 hover:bg-red-800"
                }`}
              >
                <p className="text-xs text-gray-200 font-mono">{log.timestamp}</p>
                <p className="text-lg font-bold flex items-center gap-2">
                  <span
                    className={`${
                      log.level === "info"
                        ? "text-sky-400"
                        : log.level === "query"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    [{log.level.toUpperCase()}]:
                  </span>
                  <span>{log.message}</span>
                </p>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
