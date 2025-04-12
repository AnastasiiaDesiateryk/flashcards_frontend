import React, { useContext, useState } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Load default words for the current user
  const loadDefaultWords = async () => {
    if (!user || !user.id) {
      setMessage("Error: User not found");
      return;
    }

    setLoading(true);
    setMessage("Loading...");

    try {
      // Send request to load default word set for this user
      const response = await API.post(`${API.defaults.baseURL}/load-defaults`, {
        userId: user.id,
      });

      setMessage(response.data.message);

      // ✅ Redirect to courses after loading
      setTimeout(() => {
        navigate("/courses");
        // Optional: refresh page if needed
        // window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Failed to load default words:", error);
      setMessage(
        error.response?.data?.message || "Error loading default words"
      );
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Settings</h2>
      <div className="mt-4">
        <button
          className="btn btn-primary"
          onClick={loadDefaultWords}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load Default Words"}
        </button>

        {/* Display feedback message */}
        {message && (
          <p className="mt-3 text-muted alert alert-info">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Settings;
