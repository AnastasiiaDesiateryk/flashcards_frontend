import React, { useState, useEffect, useContext } from "react";
import API from "../utils/api";
import "../styles/MemoGameCore.css";
import { AuthContext } from "../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import "../styles/MemoGameCore.css";

const MemoGameCore = () => {
  const { user } = useContext(AuthContext);
  const { courseName, lessonName } = useParams();
  const decodedCourseName = decodeURIComponent(courseName);
  const decodedLessonName = decodeURIComponent(lessonName);

  const [rawWords, setRawWords] = useState([]);
  const [shuffledPairs, setShuffledPairs] = useState([]);
  const [flippedPairs, setFlippedPairs] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [round, setRound] = useState(0);
  const [progressUpdated, setProgressUpdated] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const CHUNK_SIZE = 8;
  const totalRounds = Math.ceil(rawWords.length / CHUNK_SIZE);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await API.get(
          `/words/${user.id}/${decodedCourseName}/${decodedLessonName}`
        );
        setRawWords(response.data);
        setRound(0);
      } catch (error) {
        console.error("Error fetching words for the game:", error);
      }
    };

    fetchWords();
  }, [user.id, decodedCourseName, decodedLessonName]);

  useEffect(() => {
    const start = round * CHUNK_SIZE;
    const current = rawWords.slice(start, start + CHUNK_SIZE);

    const pairs = current.flatMap((card) => [
      {
        id: `${card._id}-word`,
        baseId: card._id,
        type: "word",
        value: card.word,
      },
      {
        id: `${card._id}-translation`,
        baseId: card._id,
        type: "translation",
        value: card.translation,
      },
    ]);

    setShuffledPairs(pairs.sort(() => Math.random() - 0.5));
    setFlippedPairs([]);
    setMatchedPairs([]);
    setGameFinished(false);
  }, [rawWords, round]);

  const handlePairClick = (card) => {
    if (matchedPairs.includes(card.id) || flippedPairs.includes(card)) return;

    if (card.type === "word") {
      try {
        const audio = new Audio(
          `http://localhost:5000/speak/${encodeURIComponent(card.value)}`
        );
        audio
          .play()
          .catch((err) => console.warn("Audio could not be played:", err));
      } catch (error) {
        console.warn("Audio error:", error);
      }
    }

    const newFlippedPairs = [...flippedPairs, card];
    setFlippedPairs(newFlippedPairs);

    if (newFlippedPairs.length === 2) {
      const [firstCard, secondCard] = newFlippedPairs;
      if (firstCard.baseId === secondCard.baseId) {
        setMatchedPairs((prev) => [...prev, firstCard.id, secondCard.id]);
        setTimeout(() => setFlippedPairs([]), 500);
      } else {
        setTimeout(() => setFlippedPairs([]), 1000);
      }
    } else if (newFlippedPairs.length > 2) {
      setFlippedPairs([]);
    }
  };

  useEffect(() => {
    const allMatched =
      shuffledPairs.length > 0 && matchedPairs.length === shuffledPairs.length;

    if (allMatched) {
      if (round + 1 >= totalRounds && !progressUpdated) {
        const updateProgress = async () => {
          try {
            await API.patch("/lesson-progress/increment", {
              userId: user.id,
              courseName: decodedCourseName,
              lessonName: decodedLessonName,
            });
            setProgressUpdated(true);
            setGameFinished(true);
          } catch (error) {
            console.error("Failed to update progress:", error);
          }
        };
        updateProgress();
      } else {
        setGameFinished(true);
      }
    }
  }, [
    matchedPairs,
    shuffledPairs,
    round,
    totalRounds,
    user.id,
    decodedCourseName,
    decodedLessonName,
    progressUpdated,
  ]);

  return (
    <div className="memory-game-container">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-center align-items-center my-5 gap-4">
        <Link
          to={`/course/${encodeURIComponent(
            courseName
          )}/lesson/${encodeURIComponent(lessonName)}`}
          className="btn btn-dark text-white rounded-circle d-flex justify-content-center align-items-center"
          style={{ width: "50px", height: "50px" }}
        >
          ←
        </Link>
        <h1>Memory Game: {decodedLessonName}</h1>
      </div>

      {/* Cards */}
      <div className="memory-grid">
        {shuffledPairs.map((card) => (
          <div
            key={card.id}
            className={`memory-card ${
              flippedPairs.includes(card) || matchedPairs.includes(card.id)
                ? "flipped"
                : ""
            }`}
            onClick={() => handlePairClick(card)}
          >
            <div className="memory-card-front">
              {flippedPairs.includes(card) || matchedPairs.includes(card.id)
                ? card.value
                : "?"}
            </div>
            <div className="memory-card-back">?</div>
          </div>
        ))}
      </div>

      {/* Round/Progress Buttons */}
      {gameFinished && round + 1 < totalRounds && (
        <div className="text-center my-4">
          <button
            className="btn btn-primary"
            onClick={() => setRound((r) => r + 1)}
          >
            Next Round →
          </button>
        </div>
      )}
      {shuffledPairs.length > 0 &&
        matchedPairs.length === shuffledPairs.length &&
        round + 1 === totalRounds && (
          <div className="text-center my-5">
            <h2 className="mb-3">🎉 Congratulations! Lesson completed.</h2>
            <Link
              to={`/course/${encodeURIComponent(courseName)}`}
              className="btn btn-success"
            >
              Back to Lessons
            </Link>
          </div>
        )}
    </div>
  );
};

export default MemoGameCore;
