import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MemoGameCore.css";
import { useParams, Link } from "react-router-dom";
import CONFIG from "../config";
import "../styles/MemoGameCore.css";

const MemoGameCore = () => {
  const { lesson } = useParams();

  const [rawWords, setRawWords] = useState([]);
  const [shuffledPairs, setShuffledPairs] = useState([]);
  const [flippedPairs, setFlippedPairs] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [round, setRound] = useState(0);

  const CHUNK_SIZE = 8;

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await axios.get(
          `${CONFIG.API_URL}/api/words?lesson=${lesson}`
        );
        setRawWords(response.data);
        setRound(0);
      } catch (error) {
        console.error("Error fetching words for the game:", error);
      }
    };

    fetchWords();
  }, [lesson]);

  useEffect(() => {
    const start = round * CHUNK_SIZE;
    const current = rawWords.slice(start, start + CHUNK_SIZE);

    const pairs = current.flatMap((card) => [
      {
        id: `${card._id}-word`,
        baseId: card._id,
        type: "word",
        value: card.word,
        audio: `${CONFIG.API_URL}/api/proxy-audio?url=${encodeURIComponent(
          card.audio
        )}`,
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
  }, [rawWords, round]);

  const handlePairClick = (card) => {
    if (matchedPairs.includes(card.id) || flippedPairs.includes(card)) return;

    if (card.type === "word" && card.audio) {
      new Audio(card.audio).play();
    }

    const newFlippedPairs = [...flippedPairs, card];
    setFlippedPairs(newFlippedPairs);

    if (newFlippedPairs.length === 2) {
      const [first, second] = newFlippedPairs;
      if (first.baseId === second.baseId) {
        setMatchedPairs((prev) => [...prev, first.id, second.id]);
        setTimeout(() => setFlippedPairs([]), 500);
      } else {
        setTimeout(() => setFlippedPairs([]), 1000);
      }
    } else if (newFlippedPairs.length > 2) {
      setFlippedPairs([]);
    }
  };

  const totalRounds = Math.ceil(rawWords.length / CHUNK_SIZE);

  return (
    <div className="memory-game-container">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-center align-items-center my-5 gap-4">
        <Link
          to="../"
          className="btn btn-dark text-white rounded-circle d-flex justify-content-center align-items-center"
          style={{ width: "50px", height: "50px" }}
        >
          ←
        </Link>
        <h1>Memory Game: {lesson}</h1>
      </div>

      {/* Cards Grid */}
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
            <div className="memory-card-inner">
              <div className="memory-card-front">
                {flippedPairs.includes(card) || matchedPairs.includes(card.id)
                  ? card.value
                  : ""}
              </div>
              <div className="memory-card-back">❓</div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Round Button */}
      {round + 1 < totalRounds && (
        <div className="text-center my-4">
          <button
            className="btn btn-success px-4 py-2"
            onClick={() => setRound((prev) => prev + 1)}
          >
            Next Round →
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoGameCore;
