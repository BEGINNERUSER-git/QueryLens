import React from "react";
import { motion } from "framer-motion";
import "./Start.css";

function Start() {
  return (
    <div className="app">
      <motion.div
        className="text"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h2>Query Optimization Visualizer</h2>
      </motion.div>
      <img
        src="https://cdn.pixabay.com/photo/2012/08/27/14/19/mountains-55067_640.png"
        className="background-image"
        alt="background"
      />
    </div>
  );
}

export default Start;
