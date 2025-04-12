import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  // State for email and password input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State to show a loading spinner while waiting for response
  const [loading, setLoading] = useState(false);

  // React Router's navigation function
  const navigate = useNavigate();

  // Function to handle the registration form submission
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Show spinner during request
    try {
      // Send POST request to backend to register user
      await axios.post("http://localhost:5000/auth/register", {
        email,
        password,
      });

      // Show success message and redirect to login page
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      // Show error if registration fails
      alert("Error registering");
    } finally {
      // Stop showing the spinner
      setLoading(false);
    }
  };

  // Show spinner if loading is true
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <div
          className="spinner-border text-success"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Render the registration form
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        {/* Email input */}
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            required
          />
        </div>

        {/* Password input */}
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
          />
        </div>

        {/* Submit button */}
        <button className="btn btn-success">Register</button>
      </form>
    </div>
  );
};

export default Register;
