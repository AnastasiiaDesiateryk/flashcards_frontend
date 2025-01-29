// Импортируем необходимые модули и стили
import React, { useState, useEffect } from "react"; // Импортируем React и хуки для работы с состоянием и эффектами
import "./WordPuzzleGame.css"; // Подключаем CSS для стилизации компонента
import { useParams } from "react-router-dom"; // Импортируем useParams для получения параметра lesson из URL
import CONFIG from "../config"; // Импортируем объект конфигурации с API URL

// Определяем функциональный компонент WordPuzzleGame
const WordPuzzleGame = () => {
  // Извлекаем параметр lesson из URL
  const { lesson } = useParams();

  // Определяем состояния
  const [word, setWord] = useState(""); // Хранит текущее слово для сборки
  const [translation, setTranslation] = useState(""); // Хранит перевод текущего слова
  const [shuffledLetters, setShuffledLetters] = useState([]); // Хранит перемешанные буквы слова
  const [assembledWord, setAssembledWord] = useState([]); // Хранит буквы, которые выбрал игрок
  const [audio, setAudio] = useState(""); // Хранит URL аудиофайла с произношением слова
  const [error, setError] = useState(null); // Хранит сообщение об ошибке, если что-то пошло не так

  const [wordList, setWordList] = useState([]); // Список всех слов в уроке
  const [completedWords, setCompletedWords] = useState(0); // Количество завершённых слов
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false); // Флаг, предотвращающий повторное воспроизведение аудио

  // useEffect вызывается при изменении параметра lesson
  useEffect(() => {
    // Асинхронная функция для загрузки слов из API
    const fetchWords = async () => {
      try {
        // Выполняем GET-запрос к API, получая слова для указанного урока
        const response = await fetch(
          `${CONFIG.API_URL}/api/words?lesson=${lesson}`
        );

        // Проверяем, успешен ли запрос
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Преобразуем ответ в JSON
        const data = await response.json();
        console.log("Загруженные слова из базы данных:", data); // Логируем данные для отладки

        setWordList(data); // Сохраняем загруженные слова в состояние

        if (data.length > 0) {
          initializeGame(data[0]); // Запускаем игру с первым словом
        } else {
          setError("Список слов пуст. Добавьте слова в базу данных."); // Выводим сообщение, если слов нет
        }
      } catch (err) {
        console.error("Ошибка при загрузке слов:", err);
        setError("Не удалось загрузить слова. Попробуйте позже.");
      }
    };

    fetchWords(); // Вызываем функцию загрузки слов при монтировании компонента
  }, [lesson]); // Запускаем эффект при изменении lesson

  // Функция инициализации игры с конкретным словом
  const initializeGame = (card) => {
    console.log("Инициализация игры для слова:", card); // Логируем данные для отладки

    setWord(card.word); // Устанавливаем новое слово
    setTranslation(card.translation); // Устанавливаем перевод слова
    setAudio(card.audio || ""); // Устанавливаем URL аудиофайла (если есть)

    // Разбиваем слово на буквы и перемешиваем их случайным образом
    setShuffledLetters(card.word.split("").sort(() => Math.random() - 0.5));
    setAssembledWord([]); // Очищаем собранное слово
    setHasPlayedAudio(false); // Сбрасываем флаг воспроизведения аудио
  };

  // Функция обработки нажатия на букву
  const handleLetterClick = (letter, index) => {
    setAssembledWord([...assembledWord, letter]); // Добавляем букву в собранное слово
    setShuffledLetters(shuffledLetters.filter((_, i) => i !== index)); // Удаляем букву из списка доступных
  };

  // Функция для сброса текущего слова
  const handleReset = () => {
    setAssembledWord([]); // Очищаем собранное слово
    setShuffledLetters(word.split("").sort(() => Math.random() - 0.5)); // Перемешиваем буквы заново
  };

  // Функция перехода к следующему слову
  const nextWord = () => {
    if (wordList.length > 1) {
      // Убираем текущее слово из wordList
      const remainingWords = wordList.slice(1);
      console.log("Оставшиеся слова:", remainingWords); // Логируем оставшиеся слова

      setWordList(remainingWords); // Обновляем список слов
      setCompletedWords(completedWords + 1); // Увеличиваем счётчик завершённых слов
      initializeGame(remainingWords[0]); // Инициализируем следующее слово
    } else {
      setError("Вы решили все доступные слова! Поздравляем!"); // Завершаем игру, если все слова решены
    }
  };

  // Функция воспроизведения аудио
  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio
        .play()
        .catch((err) => console.error("Ошибка воспроизведения аудио:", err));
    }
  };

  // useEffect для воспроизведения аудио при правильной сборке слова
  useEffect(() => {
    if (assembledWord.join("") === word && !hasPlayedAudio) {
      const audioUrl = `${
        CONFIG.API_URL
      }/api/proxy-audio?url=${encodeURIComponent(audio)}`;
      playAudio(audioUrl);
      setHasPlayedAudio(true);
    }
  }, [assembledWord, word, hasPlayedAudio, audio]);

  return (
    <div className="word-puzzle-game">
      <h1>Собери слово</h1>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {/* Прогресс-бар */}
          <div className="progress-bar-container">
            <label>Прогресс:</label>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${
                    (completedWords / (completedWords + wordList.length)) * 100
                  }%`,
                }}
              >
                {completedWords}/{completedWords + wordList.length}
              </div>
            </div>
          </div>

          <p>
            Перевод: <strong>{translation}</strong>
          </p>

          {/* Отображение собранного слова */}
          <div className="assembled-word">
            {assembledWord.map((letter, index) => (
              <span key={index} className="letter">
                {letter}
              </span>
            ))}
          </div>

          {/* Буквы для составления слова */}
          <div className="container">
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
          </div>

          {/* Кнопки управления */}
          <div className="controls">
            <button className="reset-button" onClick={handleReset}>
              Сбросить
            </button>
            {/* <button className="reset-button" onClick={() => playAudio(audio)}>
              Озвучить слово
            </button> */}
          </div>

          {/* Сообщение об успехе */}
          {assembledWord.join("") === word && (
            <div className="success-message">
              <h2>Поздравляем! Вы собрали слово: {word} 🎉</h2>
              <button className="next-button" onClick={nextWord}>
                Следующее слово
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WordPuzzleGame;

