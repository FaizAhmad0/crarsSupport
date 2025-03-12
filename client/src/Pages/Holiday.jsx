import React from "react";

const Holiday = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white p-5">
      <h1 className="text-5xl font-bold mb-4">Happy Holi! 🎨🌸</h1>
      <p className="text-lg text-center max-w-2xl">
        Holi is a festival of colors, joy, and togetherness! Celebrate from
        today until the 17th with vibrant colors, delicious sweets, and
        happiness all around. May this festival bring prosperity, positivity,
        and love into your life. 🌈🎉
      </p>
      <div className="mt-6 p-4 bg-white text-black rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Festival Duration: </h2>
        <p className="text-lg">March {new Date().getDate()} - March 17</p>
      </div>
      <p className="mt-4 text-lg font-semibold">
        You can book appointments from the 17th. Enjoy Holi! 🎊
      </p>
    </div>
  );
};

export default Holiday;
