import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner"; // 🔥 Import Toast Sonner

// Koneksi ke socket.io
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
});

function App() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!isAuthenticated) return;
    socket.on("log", (data) => {
      setLogs((prevLogs) => [data, ...prevLogs]); // Menyimpan semua log tanpa batas
    });

    return () => {
      socket.off("log");
    };
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === import.meta.env.VITE_ACC_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setPassword("");
      toast.error("Password salah! 🔑", {
        description: "Silakan coba lagi.",
      }); // 🚀 Tampilkan notifikasi
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      {/* Toast Container */}
      <Toaster
        position="top-right"
        richColors
        duration={3000}
        closeButton
      />{" "}
      {/* 🔥 Tambahkan Toaster */}
      {/* Modal Password */}
      <AnimatePresence>
        {!isAuthenticated && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black/80 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-4">🔒 Masukkan Password</h2>
              <input
                type={visible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                placeholder="Password..."
              />
              <p
                className="text-xs mt-2 text-end cursor-pointer"
                onClick={() => setVisible(!visible)}
              >
                {!visible ? "Tampilkan" : "Sembunyikan"}
              </p>
              <button
                onClick={handleLogin}
                className="mt-4 bg-blue-500 text-sm w-full hover:bg-blue-600 px-4 py-2 rounded text-white font-bold"
              >
                Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Konten utama setelah login */}
      {isAuthenticated && (
        <>
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
                  filter === type
                    ? "bg-blue-500"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                <p className="text-xs w-24">{type.toUpperCase()}</p>
              </button>
            ))}
          </div>

          {/* Log List */}
          <div className="space-y-4 max-w-3xl mx-auto overflow-y-auto max-h-[80vh]">
            <AnimatePresence>
              {logs
                .filter((log) => filter === "all" || log.level === filter)
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
                    <p className="text-xs text-gray-200 font-mono">
                      {log.timestamp}
                    </p>
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
        </>
      )}
    </div>
  );
}

export default App;
