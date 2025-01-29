
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import MemoryGame from "./components/MemoryGame";
import Home from "./components/Home";
import LessonPage from "./components/LessonPage";
import ImportWords from "./components/ImportWords";
import WordPuzzleGame from "./components/WordPuzzleGame";
import Navigation from "./components/Navigation";


function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />

        {/* Маршруты */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lesson/:lesson" element={<LessonPage />} />
          <Route path="/memogame/:lesson" element={<MemoryGame />} />
          <Route path="/puzzlegame/:lesson" element={<WordPuzzleGame />} />
          {/* <Route path="/intervalgame/:lesson" element={<IntervalGame />} /> */}
          {/* <Route path="/preparewords/:lesson" element={<PreparePage />} /> */}
          <Route path="/import" element={<ImportWords />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
