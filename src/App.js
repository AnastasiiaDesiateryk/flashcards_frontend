import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import CourseLessons from "./pages/CourseLessons";
import Lesson from "./pages/Lesson";
import Settings from "./pages/Settings";
import GamePuzzle from "./pages/GamePuzzle";
import GameMemoCard from "./pages/GameMemoCard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navigation />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseName"
              element={
                <ProtectedRoute>
                  <CourseLessons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseName/lesson/:lessonName"
              element={
                <ProtectedRoute>
                  <Lesson />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/game-puzzle/course/:courseName/lesson/:lessonName"
              element={
                <ProtectedRoute>
                  <GamePuzzle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/game-memo/course/:courseName/lesson/:lessonName"
              element={
                <ProtectedRoute>
                  <GameMemoCard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
