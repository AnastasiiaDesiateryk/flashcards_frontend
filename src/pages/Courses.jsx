import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import "../styles/Courses.css";

const Courses = () => {
  const { user } = useContext(AuthContext); // Get the logged-in user from context
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchCourses = async () => {
      try {
        // Fetch courses for the current user
        const response = await API.get(`/courses/${user.id}`);
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Failed to load courses:", error);
      }
    };

    fetchCourses();
  }, [user]);
  useEffect(() => {
    document.body.classList.add("course-page");
    return () => {
      document.body.classList.remove("course-page");
    };
  }, []);
  return (
    <div className="courses-container-light mt-4 px-3">
      <div className="course-header text-center mb-5">
        <h2 className="course-title">Your Courses</h2>
        <p className="course-subtitle">
          Choose a course below to start learning and track your progress
        </p>
      </div>
      {courses.length === 0 ? (
        <div className="text-center mt-4">
          <p>You don't have any courses yet.</p>
          <Link to="/settings" className="btn btn-primary">
            Go to Settings
          </Link>
        </div>
      ) : (
        <div className="row w-100">
          {courses.map((course, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="course-card-light h-100">
                <h5 className="text-center">{course}</h5>
                <Link
                  to={`/course/${encodeURIComponent(course)}`}
                  className="btn btn-info w-100 fw-semibold"
                >
                  Open Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
