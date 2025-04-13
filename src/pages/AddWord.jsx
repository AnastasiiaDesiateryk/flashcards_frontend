// import React, { useEffect, useState, useContext } from "react";
// import API from "../utils/api";
// import { AuthContext } from "../context/AuthContext";

// const AddWord = () => {
//   const { user } = useContext(AuthContext);

//   const [courses, setCourses] = useState([]);
//   const [lessons, setLessons] = useState([]);

//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [customCourse, setCustomCourse] = useState("");

//   const [selectedLesson, setSelectedLesson] = useState("");
//   const [customLesson, setCustomLesson] = useState("");

//   const [word, setWord] = useState("");
//   const [translation, setTranslation] = useState("");

//   // Use either selected or custom-entered course/lesson
//   const actualCourse = customCourse || selectedCourse;
//   const actualLesson = customLesson || selectedLesson;

//   // Load list of available courses for current user
//   useEffect(() => {
//     if (!user?.id) return;

//     const loadCourses = async () => {
//       try {
//         const res = await API.get(`/courses/${user.id}`);
//         setCourses(res.data.courses);
//       } catch (err) {
//         console.error("Failed to load courses", err);
//       }
//     };

//     loadCourses();
//   }, [user]);

//   // Load lessons based on selected course
//   useEffect(() => {
//     if (!user?.id || !actualCourse) return;

//     const loadLessons = async () => {
//       try {
//         const res = await API.get(
//           `/lessons/${user.id}/${encodeURIComponent(actualCourse)}`
//         );
//         setLessons(res.data.lessons);
//       } catch (err) {
//         console.error("Failed to load lessons", err);
//       }
//     };

//     loadLessons();
//   }, [actualCourse, user]);

//   // Submit form to add a new word
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await API.post("/words", {
//         userId: user.id,
//         courseName: actualCourse,
//         lessonName: actualLesson,
//         word,
//         translation,
//       });

//       alert("Word added successfully!");

//       setWord("");
//       setTranslation("");
//     } catch (err) {
//       console.error("Error adding word", err);
//       alert("Failed to add word");
//     }
//   };

//   return (
//     <div className="container mt-5" style={{ maxWidth: "600px" }}>
//       <h3 className="mb-4">Add a New Word</h3>
//       <form onSubmit={handleSubmit}>
//         {/* Select or create a course */}
//         <div className="mb-3">
//           <label className="form-label">Course:</label>
//           <select
//             className="form-select"
//             value={selectedCourse}
//             onChange={(e) => {
//               setSelectedCourse(e.target.value);
//               setCustomCourse("");
//               setSelectedLesson("");
//               setCustomLesson("");
//             }}
//             disabled={!!customCourse}
//           >
//             <option value="">-- Select course --</option>
//             {courses.map((course, i) => (
//               <option key={i} value={course}>
//                 {course}
//               </option>
//             ))}
//           </select>
//           <input
//             type="text"
//             className="form-control mt-2"
//             placeholder="or enter a new course"
//             value={customCourse}
//             onChange={(e) => {
//               setCustomCourse(e.target.value);
//               setSelectedCourse("");
//               setSelectedLesson("");
//               setCustomLesson("");
//             }}
//           />
//         </div>

//         {/* Select or create a lesson */}
//         <div className="mb-3">
//           <label className="form-label">Lesson:</label>
//           <select
//             className="form-select"
//             value={selectedLesson}
//             onChange={(e) => {
//               setSelectedLesson(e.target.value);
//               setCustomLesson("");
//             }}
//             disabled={!!customLesson || !actualCourse}
//           >
//             <option value="">-- Select lesson --</option>
//             {lessons.map((lesson, i) => (
//               <option key={i} value={lesson}>
//                 {lesson}
//               </option>
//             ))}
//           </select>
//           <input
//             type="text"
//             className="form-control mt-2"
//             placeholder="or enter a new lesson"
//             value={customLesson}
//             onChange={(e) => {
//               setCustomLesson(e.target.value);
//               setSelectedLesson("");
//             }}
//             disabled={!actualCourse}
//           />
//         </div>

//         {/* Word input */}
//         <div className="mb-3">
//           <label className="form-label">Word:</label>
//           <input
//             type="text"
//             className="form-control"
//             value={word}
//             onChange={(e) => setWord(e.target.value)}
//             required
//           />
//         </div>

//         {/* Translation input */}
//         <div className="mb-4">
//           <label className="form-label">Translation:</label>
//           <input
//             type="text"
//             className="form-control"
//             value={translation}
//             onChange={(e) => setTranslation(e.target.value)}
//             required
//           />
//         </div>

//         {/* Submit button */}
//         <button
//           type="submit"
//           className="btn btn-success w-100"
//           disabled={!actualCourse || !actualLesson || !word || !translation}
//         >
//           Add Word
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddWord;
import React, { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const AddWord = () => {
  const { user } = useContext(AuthContext);

  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [customCourse, setCustomCourse] = useState("");

  const [selectedLesson, setSelectedLesson] = useState("");
  const [customLesson, setCustomLesson] = useState("");

  const [wordBlock, setWordBlock] = useState("");
  const [delimiter, setDelimiter] = useState("|");

  const actualCourse = customCourse || selectedCourse;
  const actualLesson = customLesson || selectedLesson;

  // Load user's courses on component mount
  useEffect(() => {
    if (!user?.id) return;

    const loadCourses = async () => {
      try {
        const res = await API.get(`/courses/${user.id}`);
        setCourses(res.data.courses);
      } catch (err) {
        console.error("Error loading courses", err);
      }
    };

    loadCourses();
  }, [user]);

  // Load lessons when course is selected
  useEffect(() => {
    if (!user?.id || !actualCourse) return;

    const loadLessons = async () => {
      try {
        const res = await API.get(
          `/lessons/${user.id}/${encodeURIComponent(actualCourse)}`
        );
        setLessons(res.data.lessons);
      } catch (err) {
        console.error("Error loading lessons", err);
      }
    };

    loadLessons();
  }, [actualCourse, user]);

  // Submit handler for adding words in bulk
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const entries = wordBlock.split("\n");
      const toInsert = [];

      for (let line of entries) {
        const parts = line.split(delimiter);
        if (parts.length === 2) {
          const word = parts[0].trim();
          const translation = parts[1].trim();
          if (word && translation) {
            toInsert.push({
              userId: user.id,
              courseName: actualCourse,
              lessonName: actualLesson,
              word,
              translation,
            });
          }
        }
      }

      for (let entry of toInsert) {
        await API.post("/words", entry);
      }

      alert(`${toInsert.length} word(s) successfully added!`);
      setWordBlock("");
    } catch (err) {
      console.error("Error adding words", err);
      alert("Something went wrong while adding words");
    }
  };

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "700px" }}>
      <h3 className="mb-4 text-center">Add New Words</h3>

      <form onSubmit={handleSubmit}>
        {/* Course selection or creation */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Course:</label>
          <select
            className="form-select"
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setCustomCourse("");
              setSelectedLesson("");
              setCustomLesson("");
            }}
            disabled={!!customCourse}
          >
            <option value="">-- Select existing course --</option>
            {courses.map((course, i) => (
              <option key={i} value={course}>
                {course}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="or enter a new course"
            value={customCourse}
            onChange={(e) => {
              setCustomCourse(e.target.value);
              setSelectedCourse("");
              setSelectedLesson("");
              setCustomLesson("");
            }}
          />
        </div>

        {/* Lesson selection or creation */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Lesson:</label>
          <select
            className="form-select"
            value={selectedLesson}
            onChange={(e) => {
              setSelectedLesson(e.target.value);
              setCustomLesson("");
            }}
            disabled={!!customLesson || !actualCourse}
          >
            <option value="">-- Select existing lesson --</option>
            {lessons.map((lesson, i) => (
              <option key={i} value={lesson}>
                {lesson}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="or enter a new lesson"
            value={customLesson}
            onChange={(e) => {
              setCustomLesson(e.target.value);
              setSelectedLesson("");
            }}
            disabled={!actualCourse}
          />
        </div>

        {/* Delimiter input */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Delimiter:</label>
          <input
            type="text"
            className="form-control"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            maxLength={3}
            required
          />
          <div className="form-text">
            Enter the symbol used to split word and translation (e.g., | or - or
            : ). <br />
            <em>
              DE: Trennzeichen für Wort und Übersetzung (z. B. | oder - oder : )
            </em>
          </div>
        </div>

        {/* Bulk word input */}
        <div className="mb-4">
          <label className="form-label fw-semibold">
            Words and Translations:
          </label>
          <textarea
            className="form-control"
            placeholder={`apple ${delimiter} Apfel\nbook ${delimiter} Buch`}
            rows={8}
            value={wordBlock}
            onChange={(e) => setWordBlock(e.target.value)}
            required
          ></textarea>
          <div className="form-text">
            Enter each word on a new line, using the selected delimiter. <br />
            <em>
              DE: Gib jedes Wort in einer neuen Zeile ein. Verwende das gewählte
              Trennzeichen.
            </em>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-success w-100 py-2 fs-5 fw-semibold"
          disabled={!actualCourse || !actualLesson || !wordBlock.trim()}
        >
          Add Words
        </button>
      </form>
    </div>
  );
};

export default AddWord;
