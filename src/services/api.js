import axios from "axios";

const API_URL = "http://localhost:5191/api";
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) => api.post("/Auth/login", data);
export const register = (data) => api.post("/Auth/register", data);
export const getProfile = () => api.get("/Users/profile");
export const updateProfile = (data) => api.put("/Users/profile", data);
export const getCourses = () => api.get("/Courses");
export const getCourse = (id) => api.get(`/Courses/${id}`);
export const getLessons = (courseId) => api.get(`/Lessons/course/${courseId}`);
export const getWordsByLesson = (lessonId) =>
  api.get(`Words/lesson/${lessonId}`);
export const getLesson = (id) => api.get(`/Lessons/${id}`);
export const getWords = () => api.get("/Words");
export const searchWords = (keyword) =>
  api.get(`/Words/search?keyword=${keyword}`);
export const getFavoriteWords = () => api.get("/FavoriteWords");
export const addFavoriteWord = (data) => api.post("/FavoriteWords", data);
export const removeFavoriteWord = (id) => api.delete(`/FavoriteWords/${id}`);
export const getQuizzes = (lessonId) => api.get(`/Quizzes/lesson/${lessonId}`);
export const createRandomQuiz = (data) => api.post("/RandomQuizzes", data);
export const getQuizResults = () => api.get("/QuizResults");
export const submitQuizResult = (data) => api.post("/QuizResults", data);
export const getDueWords = () => api.get("/UserProgress/due");
export const reviewWord = (progressId) =>
  api.post(`/UserProgress/review/${progressId}`);
export const getStatistics = () => api.get("/Statistics");
export const getSearchHistory = () => api.get("/DictionarySearches");
export const addSearch = (data) => api.post("/DictionarySearches", data);

export default api;
