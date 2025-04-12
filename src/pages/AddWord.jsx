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

  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");

  // Use either selected or custom-entered course/lesson
  const actualCourse = customCourse || selectedCourse;
  const actualLesson = customLesson || selectedLesson;

  // Load list of available courses for current user
  useEffect(() => {
    if (!user?.id) return;

    const loadCourses = async () => {
      try {
        const res = await API.get(`/courses/${user.id}`);
        setCourses(res.data.courses);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };

    loadCourses();
  }, [user]);

  // Load lessons based on selected course
  useEffect(() => {
    if (!user?.id || !actualCourse) return;

    const loadLessons = async () => {
      try {
        const res = await API.get(
          `/lessons/${user.id}/${encodeURIComponent(actualCourse)}`
        );
        setLessons(res.data.lessons);
      } catch (err) {
        console.error("Failed to load lessons", err);
      }
    };

    loadLessons();
  }, [actualCourse, user]);

  // Submit form to add a new word
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/words", {
        userId: user.id,
        courseName: actualCourse,
        lessonName: actualLesson,
        word,
        translation,
      });

      alert("Word added successfully!");

      setWord("");
      setTranslation("");
    } catch (err) {
      console.error("Error adding word", err);
      alert("Failed to add word");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">Add a New Word</h3>
      <form onSubmit={handleSubmit}>
        {/* Select or create a course */}
        <div className="mb-3">
          <label className="form-label">Course:</label>
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
            <option value="">-- Select course --</option>
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

        {/* Select or create a lesson */}
        <div className="mb-3">
          <label className="form-label">Lesson:</label>
          <select
            className="form-select"
            value={selectedLesson}
            onChange={(e) => {
              setSelectedLesson(e.target.value);
              setCustomLesson("");
            }}
            disabled={!!customLesson || !actualCourse}
          >
            <option value="">-- Select lesson --</option>
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

        {/* Word input */}
        <div className="mb-3">
          <label className="form-label">Word:</label>
          <input
            type="text"
            className="form-control"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            required
          />
        </div>

        {/* Translation input */}
        <div className="mb-4">
          <label className="form-label">Translation:</label>
          <input
            type="text"
            className="form-control"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={!actualCourse || !actualLesson || !word || !translation}
        >
          Add Word
        </button>
      </form>
    </div>
  );
};

export default AddWord;
