import React from "react";

const Profile = () => {
  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "75vh" }}
    >
      <div className="text-center px-3" style={{ maxWidth: "600px" }}>
        <h2 className="fw-semibold mb-3">Your Profile</h2>
        <p className="text-muted mb-4">
          Welcome to your personal space. This page will soon show your learning
          progress and personal information.
        </p>

        <div className="border-top pt-4">
          <p className="text-muted">
            You're using a beautifully designed, well-structured learning
            platform built to help you grow. Enjoy a clean interface, intuitive
            navigation, and smart tools to track your vocabulary progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
