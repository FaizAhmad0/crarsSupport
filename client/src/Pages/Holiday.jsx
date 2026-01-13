import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Sparkles } from "lucide-react";

export default function Holiday() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 overflow-hidden">
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-10 left-10 text-orange-300"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Sparkles size={40} />
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-10 text-yellow-300"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <Sparkles size={50} />
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-10 max-w-xl text-center"
      >
        <motion.div
          className="absolute top-5 right-5 text-orange-300"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles size={40} />
        </motion.div>
        <motion.div
          className="absolute bottom-5 left-2 text-orange-300"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles size={40} />
        </motion.div>
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl font-bold text-orange-600 mb-4"
        >
          🎉 Makar Sankranti Holiday 🎉
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-black text-lg leading-relaxed"
        >
          Our Company Support Portal will remain temporarily closed in
          observance of <span className="font-semibold">Makar Sankranti</span>.
        </motion.p>

        {/* Dates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex items-center justify-center gap-3 mt-6 text-gray-800"
        >
          <CalendarDays className="text-orange-500" />
          <span className="font-medium">14 January – 15 January</span>
        </motion.div>

        {/* Reopen Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4"
        >
          <p className="text-orange-700 font-semibold">
            The portal will reopen on{" "}
            <span className="underline">16 January</span>.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-8 text-sm text-gray-500"
        >
          Thank you for your patience and warm wishes for the festive season.
        </motion.p>
      </motion.div>
    </div>
  );
}
