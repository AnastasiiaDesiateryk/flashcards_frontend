import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api"; // Import our API configuration

const Login = () => {
  // State for input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Access the login function from AuthContext
  const { login } = useContext(AuthContext);

  // State to show a loading spinner while waiting for a response
  const [loading, setLoading] = useState(false);

  // React Router's navigation function
  const navigate = useNavigate();

  // Function to handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Show spinner while waiting for response
    try {
      // Send login request to backend
      const res = await API.post("/auth/login", { email, password });

      // Save the token using context
      login(res.data.accessToken);

      // Redirect to homepage after successful login
      navigate("/");
    } catch (error) {
      // Show error if login fails
      alert("Invalid credentials");
    } finally {
      // Hide spinner after request is complete
      setLoading(false);
    }
  };

  // Show spinner while loading
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Render the login form
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
