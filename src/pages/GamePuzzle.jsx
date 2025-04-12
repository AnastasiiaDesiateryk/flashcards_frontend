import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import PuzzleGameCore from "../components/PuzzleGameCore";

const GamePuzzle = () => {
  const { user } = useContext(AuthContext);
  const { courseName, lessonName } = useParams();
  const decodedCourseName = decodeURIComponent(courseName);
  const decodedLessonName = decodeURIComponent(lessonName);

  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameFinished, setGameFinished] = useState(false);
  const [progressUpdated, setProgressUpdated] = useState(false);

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchWords = async () => {
      try {
        // Fetch words for this lesson
        const response = await API.get(
          `/words/${user.id}/${decodedCourseName}/${decodedLessonName}`
        );
        setWords(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load words:", error);
        setLoading(false);
      }
    };

    fetchWords();
  }, [user, decodedCourseName, decodedLessonName]);

  // Go to next word or finish the game
  const handleNextWord = () => {
    const nextIndex = currentWordIndex + 1;

    if (nextIndex < words.length) {
      setCurrentWordIndex(nextIndex);
    } else {
      setGameFinished(true); // Game (lesson) is finished
    }
  };

  // 🔥 Update progress once game is finished
  useEffect(() => {
    if (gameFinished && !progressUpdated) {
      const incrementProgress = async () => {
        try {
          await API.patch("/lesson-progress/increment", {
            userId: user.id,
            courseName: decodedCourseName,
            lessonName: decodedLessonName,
          });
          console.log("Puzzle progress updated ✅");
          setProgressUpdated(true);
        } catch (error) {
          console.error("Failed to update progress:", error);
        }
      };

      incrementProgress();
    }
  }, [
    gameFinished,
    progressUpdated,
    user.id,
    decodedCourseName,
    decodedLessonName,
  ]);

  if (loading) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  return (
    <div className="container mt-5 text-center">
      <h2>Puzzle Game</h2>
      <h4>Lesson: {decodedLessonName}</h4>

      {words.length === 0 ? (
        <p>No words available in this lesson.</p>
      ) : gameFinished ? (
        <div className="my-5">
          <h3 className="mb-3">
            🎉 Congratulations! You completed all words! 🎉
          </h3>
          <Link
            to={`/course/${encodeURIComponent(courseName)}`}
            className="btn btn-success"
          >
            Back to Lessons
          </Link>
        </div>
      ) : (
        <PuzzleGameCore
          wordData={words[currentWordIndex]} // Pass current word
          onNext={handleNextWord} // Handle word change
        />
      )}
    </div>
  );
};

export default GamePuzzle;
