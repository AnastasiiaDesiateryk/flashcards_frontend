import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";

const Lesson = () => {
  const { user } = useContext(AuthContext);
  const { courseName, lessonName } = useParams();

  // Decode course and lesson names from URL
  const decodedCourseName = decodeURIComponent(courseName);
  const decodedLessonName = decodeURIComponent(lessonName);

  const [words, setWords] = useState([]);

  // Fetch words for this lesson when component mounts or params change
  useEffect(() => {
    if (!user || !user.id) return;

    const fetchWords = async () => {
      try {
        const response = await API.get(
          `/words/${user.id}/${decodedCourseName}/${decodedLessonName}`
        );
        setWords(response.data);
      } catch (error) {
        console.error("Failed to load words:", error);
      }
    };

    fetchWords();
  }, [user, decodedCourseName, decodedLessonName]);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Lesson: {decodedLessonName}</h2>

      {words && words.length === 0 ? (
        <p className="text-center mt-4">
          There are no words in this lesson yet.
        </p>
      ) : words ? (
        <>
          <div className="row">
            {words.map((wordObj, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card p-3 shadow-sm">
                  <h5 className="text-center">{wordObj.word}</h5>
                  <p className="text-center text-muted">
                    {wordObj.translation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 🔹 Game navigation buttons */}
          <div className="mt-4 text-center">
            <Link
              to={`/game-memo/course/${encodeURIComponent(
                courseName
              )}/lesson/${encodeURIComponent(lessonName)}`}
              className="btn btn-outline-primary me-3"
            >
              Game: Memo
            </Link>
            <Link
              to={`/game-puzzle/course/${encodeURIComponent(
                courseName
              )}/lesson/${encodeURIComponent(lessonName)}`}
              className="btn btn-outline-secondary"
            >
              Game: Puzzle
            </Link>
          </div>
        </>
      ) : (
        <p className="text-center mt-4">Loading...</p>
      )}
    </div>
  );
};

export default Lesson;
