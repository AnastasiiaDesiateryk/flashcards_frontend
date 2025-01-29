import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CONFIG from "../config.js";
import "../App.css";

const Home = () => {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get(`${CONFIG.API_URL}/api/words/lessons`);
        setLessons(response.data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchLessons();
  }, []);

  const handleDelete = (lesson) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${lesson}?`
    );
    if (confirmDelete) {
      setLessons(lessons.filter((l) => l !== lesson));
      // Optionally, add a request to delete on the server:
      axios.delete(`${CONFIG.API_URL}/api/words/lessons/${lesson}`);
    }
  };

  return (
    <div className="container pt-5">
      <h1 className="text-center mb-5">Select a Lesson</h1>
      <div className="lessons-container">
        {lessons.map((lesson) => (
          <div className="lesson-card" key={lesson}>
            <Link to={`/lesson/${lesson}`} className="lesson-title">
              {lesson}
            </Link>
            <button
              className="delete-button"
              onClick={() => handleDelete(lesson)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
