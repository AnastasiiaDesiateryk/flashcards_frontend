import React, { useState, useEffect, useCallback } from "react";
import "../styles/PuzzleGameCore.css"; // Styles

const PuzzleGameCore = ({ wordData, onNext }) => {
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [assembledWord, setAssembledWord] = useState([]);

  // 🛠️ Initialize the game when wordData changes
  const initializeGame = useCallback(() => {
    if (!wordData) return;
    const shuffled = wordData.word.split("").sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
    setAssembledWord([]);
  }, [wordData]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle user selecting a letter
  const handleLetterClick = (letter, index) => {
    setAssembledWord([...assembledWord, letter]);
    setShuffledLetters(shuffledLetters.filter((_, i) => i !== index));
  };

  // Reset puzzle with shuffled letters again
  const handleReset = () => {
    initializeGame();
  };

  // Optional: speak the word and then go to next
  const playWord = async (word) => {
    try {
      const audio = new Audio(
        `http://localhost:5000/speak/${encodeURIComponent(word)}`
      );
      audio.play();
      audio.onended = () => {
        onNext(); // Move to next word after audio finishes
      };
    } catch (error) {
      console.error("Error playing audio:", error);
      onNext(); // Fallback to next even if audio fails
    }
  };

  // Watch for success — if correct, trigger next after delay
  useEffect(() => {
    const isCorrect = assembledWord.join("") === wordData.word;
    if (!isCorrect) return;

    try {
      const audio = new Audio(
        `http://localhost:5000/speak/${encodeURIComponent(wordData.word)}`
      );
      audio.play().catch((err) => {
        console.warn("Audio could not play:", err);
      });
    } catch (error) {
      console.warn("Audio error:", error);
    }

    // Proceed to next word after short delay
    const timer = setTimeout(() => {
      onNext();
    }, 1000); // you can change to 500ms for faster transition

    return () => clearTimeout(timer);
  }, [assembledWord, wordData, onNext]);

  return (
    <div className="game-content">
      <h1>Puzzle Game</h1>
      <p className="translation">
        Translation: <strong>{wordData.translation}</strong>
      </p>

      {/* Display assembled word */}
      <div className="assembled-word">
        {assembledWord.map((letter, index) => (
          <span key={index} className="letter">
            {letter}
          </span>
        ))}
      </div>

      {/* Display clickable shuffled letters */}
      <div className="shuffled-letters">
        {shuffledLetters.map((letter, index) => (
          <button
            key={index}
            className="letter-button"
            onClick={() => handleLetterClick(letter, index)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="controls">
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Show success emojis when correct */}
      {assembledWord.join("") === wordData.word && (
        <div className="success-message">
          <h2> 🎉🎉🎉🎉🎉</h2>
        </div>
      )}
    </div>
  );
};

export default PuzzleGameCore;
