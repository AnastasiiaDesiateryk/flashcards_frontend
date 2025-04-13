import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      className="container d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "85vh", maxWidth: "800px" }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="text-center px-3">
        <motion.h1
          className="fw-semibold mb-3"
          style={{ fontSize: "2.5rem" }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to the Learning Platform
        </motion.h1>

        <motion.p
          className="text-muted mb-4"
          style={{ fontSize: "1.125rem" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Expand your vocabulary through structured lessons and interactive
          games.
        </motion.p>

        <motion.p
          className="mb-4 text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Explore <strong>courses</strong> filled with practical{" "}
          <strong>lessons</strong>. Practice using modern, effective tools:
        </motion.p>

        <motion.div
          className="text-start mx-auto"
          style={{ maxWidth: "520px" }}
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {[
            {
              icon: "bi bi-puzzle-fill text-primary",
              title: "Puzzle Game",
              desc: "Build the word by arranging shuffled letters in the correct order.",
            },
            {
              icon: "bi bi-columns-gap text-success",
              title: "Memo Game",
              desc: "Match words with their correct translations by flipping cards.",
            },
            {
              icon: "bi bi-plus-circle-fill text-info",
              title: "Custom Words",
              desc: "Add your own words to any course or lesson to tailor your learning.",
            },
          ].map((item, index) => (
            <motion.div
              className="mb-4 d-flex"
              key={index}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <i
                className={`${item.icon} me-3`}
                style={{ fontSize: "1.5rem" }}
              ></i>
              <div>
                <div className="fw-medium mb-1">{item.title}</div>
                <div className="text-muted small">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="d-flex gap-3 justify-content-center flex-wrap mt-4 mb-5" // <- добавили mb-5
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Link to="/courses" className="btn btn-dark px-4 py-2">
            Go to Courses
          </Link>
          <Link to="/profile" className="btn btn-outline-secondary px-4 py-2">
            View Profile
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
