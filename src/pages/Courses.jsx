import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";

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

  return (
    <div className="container mt-5">
      <h2 className="text-center">Your Courses</h2>
      {courses.length === 0 ? (
        <div className="text-center mt-4">
          <p>You don't have any courses yet.</p>
          <Link to="/settings" className="btn btn-primary">
            Go to Settings
          </Link>
        </div>
      ) : (
        <div className="row">
          {courses.map((course, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card p-3 shadow-sm">
                <h5 className="text-center">{course}</h5>
                <Link
                  to={`/course/${encodeURIComponent(course)}`}
                  className="btn btn-outline-primary mt-2"
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
