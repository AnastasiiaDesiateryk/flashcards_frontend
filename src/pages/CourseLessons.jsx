import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import "../styles/CourseLesson.css";

const CourseLessons = () => {
  const { user } = useContext(AuthContext);
  const { courseName } = useParams();
  const decodedCourseName = decodeURIComponent(courseName); // ✅ Decode course name from URL

  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchLessons = async () => {
      try {
        // 1. Get lessons for the course
        const response = await API.get(
          `/lessons/${user.id}/${decodedCourseName}`
        );
        setLessons(response.data.lessons);

        // 2. Get user progress for each lesson
        const progressRes = await API.get(
          `/lesson-progress/${user.id}/${decodedCourseName}`
        );
        setProgress(progressRes.data); // Expected: [{ lessonName, repeats }]
      } catch (error) {
        console.error("Failed to load lessons:", error);
      }
    };

    fetchLessons();
  }, [user, decodedCourseName]);

  // Get how many times the lesson was repeated
  const getRepeatCount = (lessonName) => {
    const item = progress.find((p) => p.lessonName === lessonName);
    return item ? item.repeats : 0;
  };

  // Calculate fill percentage (max 4 repetitions = 100%)
  const getRepeatPercentage = (lessonName) => {
    const count = getRepeatCount(lessonName);
    if (count <= 0) return 0;
    if (count >= 4) return 100;
    return (count / 4) * 100;
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Lessons for "{decodedCourseName}"</h2>
      {lessons.length === 0 ? (
        <p className="text-center mt-4">No available lessons.</p>
      ) : (
        <div className="row">
          {lessons.map((lesson, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card p-3 shadow-sm lesson-card">
                {/* Progress fill background */}
                <div
                  className="lesson-card-fill"
                  style={{ width: `${getRepeatPercentage(lesson)}%` }}
                ></div>

                {/* Lesson content */}
                <div className="lesson-card-content">
                  <h5 className="text-center">{lesson}</h5>
                  <Link
                    to={`/course/${encodeURIComponent(
                      courseName
                    )}/lesson/${encodeURIComponent(lesson)}`}
                    className="btn btn-outline-primary w-100 mt-2"
                  >
                    Open Lesson
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseLessons;
