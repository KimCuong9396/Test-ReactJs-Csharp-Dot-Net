import React, { useState, useEffect } from "react";
import axios from "axios";

const VocabularyManager = () => {
  const [words, setWords] = useState([]);
  const [formData, setFormData] = useState({
    wordText: "",
    title: "",
    mean: "",
    example: "",
    pronunciation: "",
    partOfSpeech: "",
    audioUrl: "",
    imageUrl: "",
    level: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Replace with your API base URL
  const API_URL = "http://localhost:5191/api/words";
  // Assuming JWT token is stored in localStorage
  const token = localStorage.getItem("token");

  // Fetch all words on component mount
  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWords(response.data.$values);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch words");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        // Update word
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Word updated successfully");
      } else {
        // Create new word
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Word created successfully");
      }
      // Close modal, reset form, and refresh words
      closeModal();
      fetchWords();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = async (id) => {
    try {
      console.log("Fetching word with ID:", id); // Debugging
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const word = response.data;
      //console.log("Word data fetched:", word); // Debugging
      setFormData({
        wordText: word.wordText || "",
        title: word.title || "",
        mean: word.mean || "",
        example: word.example || "",
        pronunciation: word.pronunciation || "",
        partOfSpeech: word.partOfSpeech || "",
        audioUrl: word.audioUrl || "",
        imageUrl: word.imageUrl || "",
        level: word.level || "",
      });
      setEditingId(id);
      setIsModalOpen(true);
      setError("");
    } catch (err) {
      console.error("Error in handleEdit:", err); // Debugging
      setError(err.response?.data?.message || "Failed to fetch word");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this word?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Word deleted successfully");
      fetchWords();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete word");
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      wordText: "",
      title: "",
      mean: "",
      example: "",
      pronunciation: "",
      partOfSpeech: "",
      audioUrl: "",
      imageUrl: "",
      level: "",
    });
    setEditingId(null);
    setError("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vocabulary Management</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <button
        onClick={openCreateModal}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Add New Word
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Word" : "Add New Word"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Word Text *</label>
                <input
                  type="text"
                  name="wordText"
                  value={formData.wordText}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Meaning</label>
                <input
                  type="text"
                  name="mean"
                  value={formData.mean}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Example</label>
                <input
                  type="text"
                  name="example"
                  value={formData.example}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Pronunciation
                </label>
                <input
                  type="text"
                  name="pronunciation"
                  value={formData.pronunciation}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Part of Speech
                </label>
                <input
                  type="text"
                  name="partOfSpeech"
                  value={formData.partOfSpeech}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Audio URL</label>
                <input
                  type="text"
                  name="audioUrl"
                  value={formData.audioUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Level</label>
                <input
                  type="text"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editingId ? "Update Word" : "Add Word"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Word List</h2>
      <div className="grid gap-4">
        {words.map((word) => (
          <div
            key={word.wordId}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{word.wordText}</h3>
              <p>Meaning: {word.mean || "-"}</p>
              <p>Title: {word.title || "-"}</p>
              <p>Example: {word.example || "-"}</p>
              <p>Level: {word.level || "-"}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(word.wordId)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(word.wordId)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyManager;
