import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MemoGameCore.css";
import { useParams, Link } from "react-router-dom";
import CONFIG from "../config";

const MemoGameCore = () => {
  const { lesson } = useParams();

  const [shuffledPairs, setShuffledPairs] = useState([]); // Shuffled cards
  const [flippedPairs, setFlippedPairs] = useState([]); // Currently flipped cards
  const [matchedPairs, setMatchedPairs] = useState([]); // Matched card IDs

  // Fetch and prepare cards when the component mounts
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await axios.get(
          `${CONFIG.API_URL}/api/words?lesson=${lesson}`
        );
        const cardData = response.data;

        // Create a word/translation pair for each word
        const preparedPairs = cardData.flatMap((card) => [
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

        // Shuffle the cards
        setShuffledPairs(preparedPairs.sort(() => Math.random() - 0.5));
      } catch (error) {
        console.error("Error fetching words for the game:", error);
      }
    };

    fetchWords();
  }, [lesson]);

  // Handle clicking a card
  const handlePairClick = (card) => {
    if (matchedPairs.includes(card.id) || flippedPairs.includes(card)) {
      return; // Do nothing if already matched or flipped
    }

    // Play audio if the card is a word and has an audio source
    if (card.type === "word" && card.audio) {
      const audio = new Audio(card.audio);
      audio.play();
    }

    const newFlippedPairs = [...flippedPairs, card];
    setFlippedPairs(newFlippedPairs);

    // If two cards are flipped, check for match
    if (newFlippedPairs.length === 2) {
      const [firstCard, secondCard] = newFlippedPairs;

      if (firstCard.baseId === secondCard.baseId) {
        // Match found
        setMatchedPairs((prev) => [...prev, firstCard.id, secondCard.id]);
        setTimeout(() => {
          setFlippedPairs([]);
        }, 500);
      } else {
        // No match — flip back
        setTimeout(() => {
          setFlippedPairs([]);
        }, 1000);
      }
    } else if (newFlippedPairs.length > 2) {
      setFlippedPairs([]);
    }
  };

  return (
    <div className="memory-game-container">
      {/* Header and back button */}
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

      {/* Card grid */}
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
                : "❓"}
            </div>
            <div className="memory-card-back">❓</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoGameCore;
