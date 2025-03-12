import React from "react";
import { motion } from "framer-motion";

const colors = ["#FF5733", "#FFC300", "#DAF7A6", "#FF33F6", "#33FFF5"];

const GulalBlast = () => {
  return colors.map((color, index) => (
    <motion.div
      key={index}
      className="absolute w-16 h-16 rounded-full"
      style={{ backgroundColor: color }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: [1, 2, 3],
        x: [(Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1500],
        y: [(Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1500],
      }}
      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.3 }}
    />
  ));
};

const Fireworks = () => {
  return Array(10)
    .fill(0)
    .map((_, index) => (
      <motion.div
        key={index}
        className="absolute w-8 h-8 bg-yellow-300 rounded-full shadow-lg"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 2, rotate: 720, y: -500 }}
        transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.5 }}
      />
    ));
};

const Confetti = () => {
  return Array(100)
    .fill(0)
    .map((_, index) => (
      <motion.div
        key={index}
        className="absolute w-3 h-3 rounded-full"
        style={{ backgroundColor: colors[index % colors.length] }}
        initial={{
          opacity: 0,
          y: -50,
          x: (Math.random() - 0.5) * 800,
          scale: 0.5,
        }}
        animate={{
          opacity: 1,
          y: 800,
          x: (Math.random() - 0.5) * 1600,
          rotate: 720,
        }}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.1 }}
      />
    ));
};

const Holiday = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white p-5 overflow-hidden">
      <h1 className="text-6xl font-extrabold mb-4 animate-bounce">
        Happy Holi! 🎨🌸
      </h1>
      <p className="text-lg text-center max-w-2xl animate-pulse">
        Holi is a festival of colors, joy, and togetherness! Celebrate from
        today until the 17th with vibrant colors, delicious sweets, and
        happiness all around. May this festival bring prosperity, positivity,
        and love into your life. 🌈🎉
      </p>
      <div className="mt-6 p-4 bg-white text-black rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Festival Duration: </h2>
        <p className="text-lg">March {new Date().getDate()} - March 17</p>
      </div>
      <p className="mt-4 text-lg font-semibold animate-wiggle">
        You can book appointments from the 17th. Enjoy Holi! 🎊
      </p>

      {/* Full-Page Celebration Effects */}
      <div className="absolute inset-0 overflow-hidden flex flex-wrap">
        <Confetti />
      </div>

      {/* Blasting Gulal Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <GulalBlast />
      </div>

      {/* Fireworks Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <Fireworks />
      </div>
    </div>
  );
};

export default Holiday;
