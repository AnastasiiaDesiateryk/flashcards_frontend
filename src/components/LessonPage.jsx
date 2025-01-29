import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import CONFIG from "../config";
const LessonPage = () => {
  const { lesson } = useParams(); // Получаем название урока из URL
  const [words, setWords] = useState([]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await axios.get(
          `${CONFIG.API_URL}/api/words?lesson=${lesson}`
        );
        console.log(`${CONFIG.API_URL}/api/words?lesson=${lesson}`);
        console.log(response);
        setWords(response.data);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    fetchWords();
  }, [lesson]);

  return (
    <div className="lesson-page container py-5">
      <h1 className="text-center mb-4">Lesson: {lesson}</h1>

      <div className="d-flex flex-column align-items-center mb-5">
        <Link to={`/memogame/${lesson}`} className="btn btn-primary mb-3 w-50">
          Memo Game
        </Link>
        <Link
          to={`/puzzlegame/${lesson}`}
          className="btn btn-success mb-3 w-50"
        >
          Puzzle Game
        </Link>
       
      </div>

      <h2 className="text-center mb-3">Words in this lesson:</h2>

      <div className="d-flex justify-content-center">
        <ul className="list-group w-75">
          {words.map((word) => (
            <li
              key={word._id}
              className="list-group-item d-flex justify-content-between"
            >
              <span className="fw-bold">{word.word}</span>
              <span>{word.translation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LessonPage;
