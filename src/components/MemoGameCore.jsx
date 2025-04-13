// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../styles/MemoGameCore.css";
// import { useParams, Link } from "react-router-dom";
// import CONFIG from "../config";

// const MemoGameCore = () => {
//   const { lesson } = useParams();

//   const [shuffledPairs, setShuffledPairs] = useState([]); // Shuffled cards
//   const [flippedPairs, setFlippedPairs] = useState([]); // Currently flipped cards
//   const [matchedPairs, setMatchedPairs] = useState([]); // Matched card IDs

//   // Fetch and prepare cards when the component mounts
//   useEffect(() => {
//     const fetchWords = async () => {
//       try {
//         const response = await axios.get(
//           `${CONFIG.API_URL}/api/words?lesson=${lesson}`
//         );
//         const cardData = response.data;

//         // Create a word/translation pair for each word
//         const preparedPairs = cardData.flatMap((card) => [
//           {
//             id: `${card._id}-word`,
//             baseId: card._id,
//             type: "word",
//             value: card.word,
//             audio: `${CONFIG.API_URL}/api/proxy-audio?url=${encodeURIComponent(
//               card.audio
//             )}`,
//           },
//           {
//             id: `${card._id}-translation`,
//             baseId: card._id,
//             type: "translation",
//             value: card.translation,
//           },
//         ]);

//         // Shuffle the cards
//         setShuffledPairs(preparedPairs.sort(() => Math.random() - 0.5));
//       } catch (error) {
//         console.error("Error fetching words for the game:", error);
//       }
//     };

//     fetchWords();
//   }, [lesson]);

//   // Handle clicking a card
//   const handlePairClick = (card) => {
//     if (matchedPairs.includes(card.id) || flippedPairs.includes(card)) {
//       return; // Do nothing if already matched or flipped
//     }

//     // Play audio if the card is a word and has an audio source
//     if (card.type === "word" && card.audio) {
//       const audio = new Audio(card.audio);
//       audio.play();
//     }

//     const newFlippedPairs = [...flippedPairs, card];
//     setFlippedPairs(newFlippedPairs);

//     // If two cards are flipped, check for match
//     if (newFlippedPairs.length === 2) {
//       const [firstCard, secondCard] = newFlippedPairs;

//       if (firstCard.baseId === secondCard.baseId) {
//         // Match found
//         setMatchedPairs((prev) => [...prev, firstCard.id, secondCard.id]);
//         setTimeout(() => {
//           setFlippedPairs([]);
//         }, 500);
//       } else {
//         // No match — flip back
//         setTimeout(() => {
//           setFlippedPairs([]);
//         }, 1000);
//       }
//     } else if (newFlippedPairs.length > 2) {
//       setFlippedPairs([]);
//     }
//   };

//   return (
//     <div className="memory-game-container">
//       {/* Header and back button */}
//       <div className="d-flex flex-wrap justify-content-center align-items-center my-5 gap-4">
//         <Link
//           to="../"
//           className="btn btn-dark text-white rounded-circle d-flex justify-content-center align-items-center"
//           style={{ width: "50px", height: "50px" }}
//         >
//           ←
//         </Link>
//         <h1>Memory Game: {lesson}</h1>
//       </div>

//       {/* Card grid */}
//       <div className="memory-grid">
//         {shuffledPairs.map((card) => (
//           <div
//             key={card.id}
//             className={`memory-card ${
//               flippedPairs.includes(card) || matchedPairs.includes(card.id)
//                 ? "flipped"
//                 : ""
//             }`}
//             onClick={() => handlePairClick(card)}
//           >
//             <div className="memory-card-front">
//               {flippedPairs.includes(card) || matchedPairs.includes(card.id)
//                 ? card.value
//                 : "❓"}
//             </div>
//             <div className="memory-card-back">❓</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MemoGameCore;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MemoGameCore.css";
import { useParams, Link } from "react-router-dom";
import CONFIG from "../config";
import "../styles/MemoGameCore.css";

const MemoGameCore = () => {
  const { lesson } = useParams();

  const [rawWords, setRawWords] = useState([]); // Оригинальные слова из API
  const [shuffledPairs, setShuffledPairs] = useState([]); // Пары для текущего раунда
  const [flippedPairs, setFlippedPairs] = useState([]); // Перевернутые карточки
  const [matchedPairs, setMatchedPairs] = useState([]); // Найденные пары
  const [round, setRound] = useState(0); // Текущий раунд

  const CHUNK_SIZE = 8;

  // Загружаем слова из API
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await axios.get(
          `${CONFIG.API_URL}/api/words?lesson=${lesson}`
        );
        setRawWords(response.data);
        setRound(0); // сброс раунда при загрузке новых слов
      } catch (error) {
        console.error("Error fetching words for the game:", error);
      }
    };

    fetchWords();
  }, [lesson]);

  // Подготовка карточек для текущего раунда
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

  // Обработка клика по карточке
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
          // <div
          //   key={card.id}
          //   className={`memory-card ${
          //     flippedPairs.includes(card) || matchedPairs.includes(card.id)
          //       ? "flipped"
          //       : ""
          //   }`}
          //   onClick={() => handlePairClick(card)}
          // >
          //   <div className="memory-card-front">
          //     {flippedPairs.includes(card) || matchedPairs.includes(card.id)
          //       ? card.value
          //       : "❓"}
          //   </div>
          //   <div className="memory-card-back">❓</div>
          // </div>
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
