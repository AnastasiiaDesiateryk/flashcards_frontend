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
  useEffect(() => {
    document.body.classList.add("course-lessons-page");
    return () => {
      document.body.classList.remove("course-lessons-page");
    };
  }, []);
  return (
    <div className="course-lessons-container mt-4 px-3">
      <div className="course-header text-center mb-5">
        <h2 className="course-title">Lessons for {decodedCourseName}</h2>
        <p className="course-subtitle">
          Choose a lesson below to start learning and track your progress
        </p>
      </div>
      {lessons.length === 0 ? (
        <p className="text-center mt-4">No available lessons.</p>
      ) : (
        <div className="row w-100">
          {lessons.map((lesson, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="lesson-card h-100">
                {/* Progress fill background */}
                <div
                  className="lesson-card-fill"
                  style={{ width: `${getRepeatPercentage(lesson)}%` }}
                ></div>

                {/* Lesson content */}
                <div className="lesson-card-content">
                  <h5>{lesson}</h5>
                  <Link
                    to={`/course/${encodeURIComponent(
                      courseName
                    )}/lesson/${encodeURIComponent(lesson)}`}
                    className="btn btn-info w-100 fw-semibold mt-3"
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
