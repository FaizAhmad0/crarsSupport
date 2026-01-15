import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-white px-4">
      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center"
      >
        {/* 404 */}
        <motion.h1
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl font-extrabold text-white drop-shadow-lg"
        >
          404
        </motion.h1>

        {/* Text */}
        <p className="mt-4 text-white/80 text-lg">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl bg-indigo-600/90 text-white font-medium shadow-lg hover:bg-indigo-500 transition"
          >
            Home
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="px-6 py-3 rounded-xl border border-white/30 text-white font-medium backdrop-blur-md hover:bg-white/10 transition"
          >
            Login
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
