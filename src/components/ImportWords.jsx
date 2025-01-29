import React, { useState } from "react";
import axios from "axios";
import CONFIG from "../config";
const ImportWords = () => {
  const [email, setEmail] = useState("");
  const [lesson, setLesson] = useState("");
  const [text, setText] = useState("");
  const [rowDelimiter, setRowDelimiter] = useState(";"); // Разделитель строк
  const [columnDelimiter, setColumnDelimiter] = useState("---"); // Разделитель колонок
  const [status, setStatus] = useState(null);

  const handleImport = async (e) => {
    e.preventDefault();

    if (!lesson) {
      setStatus("Lesson is required!");
      return;
    }

    try {
      const response = await axios.post(`${CONFIG.API_URL}/api/words/import`, {
        email,
        lesson,
        text,
        rowDelimiter,
        columnDelimiter,
      });

      setStatus(`Successfully imported ${response.data.words.length} words.`);
      // Очищаем поля формы
      setEmail("");
      setLesson("");
      setText("");
      setRowDelimiter(";");
      setColumnDelimiter("---");
    } catch (err) {
      console.error("Error during import:", err);
      setStatus(err.response?.data?.error || "An unexpected error occurred.");
    }
  };

  return (
    <div className="import-words container py-5">
      <h2 className="text-center mb-4">Import Words from Text</h2>
      <form onSubmit={handleImport} className="needs-validation">
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Lesson:</label>
          <input
            type="text"
            className="form-control"
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            placeholder="Enter lesson name or ID"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            Words and Translations (Text Input):
          </label>
          <textarea
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="10"
            placeholder="word1---translation1; word2---translation2;"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Column Delimiter:</label>
          <input
            type="text"
            className="form-control"
            value={columnDelimiter}
            onChange={(e) => setColumnDelimiter(e.target.value)}
            placeholder="e.g., \\t (tab)"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Row Delimiter:</label>
          <input
            type="text"
            className="form-control"
            value={rowDelimiter}
            onChange={(e) => setRowDelimiter(e.target.value)}
            placeholder="e.g., \\n (newline)"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Import Words
        </button>
      </form>
      {status && <p className="mt-3 alert alert-info">{status}</p>}
    </div>
  );
};
export default ImportWords;
