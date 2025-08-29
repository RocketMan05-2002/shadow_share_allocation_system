import React from "react";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-100">
      {/* Ghost Logo */}
      <img
        src="/image.png" // <-- save your ghost image as ghost.png inside /public/assets
        alt="Ghost Logo"
        className="w-20 h-18 mb-6"
      />

      {/* Loading Bar */}
      <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-full bg-black"
        />
      </div>

      {/* Loading Text */}
      <p className="mt-4 text-black font-medium tracking-wide">
        Booting up...
      </p>
    </div>
  );
}