// import React, { useState, useEffect } from "react";
// import { getQuizzes, createQuiz } from "../services/api";

// const QuizList = ({ lessonId }) => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedQuiz, setSelectedQuiz] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [newQuizTitle, setNewQuizTitle] = useState("");
//   const [newQuizDescription, setNewQuizDescription] = useState("");

//   // Lấy danh sách quiz khi lessonId thay đổi
//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const response = await getQuizzes(lessonId);
//         setQuizzes(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load quizzes");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchQuizzes();
//   }, [lessonId]);

//   // Xử lý tạo quiz mới
//   const handleCreateQuiz = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const quizData = {
//         lessonId,
//         title: newQuizTitle,
//         description: newQuizDescription,
//         quizType: "MultipleChoice",
//       };
//       const response = await createQuiz(quizData);
//       const newQuiz = response.data.quiz;
//       setQuizzes([...quizzes, newQuiz]);
//       setQuestions(response.data.questions || []);
//       setSelectedQuiz(newQuiz);
//       setNewQuizTitle("");
//       setNewQuizDescription("");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to create quiz");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Xử lý chọn quiz để hiển thị câu hỏi
//   const handleTakeQuiz = (quiz) => {
//     setSelectedQuiz(quiz);
//     // Vì câu hỏi không lưu trong DB, giả sử gọi lại API tạo quiz để lấy câu hỏi
//     // Trong thực tế, cần endpoint riêng để lấy câu hỏi
//     createQuiz({
//       lessonId: quiz.lessonId,
//       title: quiz.title,
//       description: quiz.description,
//       quizType: quiz.quizType,
//     })
//       .then((response) => {
//         setQuestions(response.data.questions || []);
//       })
//       .catch((err) => {
//         setError("Failed to load quiz questions");
//       });
//   };

//   return (
//     <div className="mt-8">
//       <h3 className="text-2xl font-bold text-primary mb-4">Quizzes</h3>

//       {/* Form tạo quiz mới */}
//       <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
//         <h4 className="text-lg font-semibold text-gray-800 mb-2">
//           Create New Quiz
//         </h4>
//         <form onSubmit={handleCreateQuiz} className="space-y-4">
//           <div>
//             <label className="block text-gray-700">Title</label>
//             <input
//               type="text"
//               value={newQuizTitle}
//               onChange={(e) => setNewQuizTitle(e.target.value)}
//               className="w-full p-2 border rounded"
//               placeholder="Enter quiz title"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700">Description</label>
//             <textarea
//               value={newQuizDescription}
//               onChange={(e) => setNewQuizDescription(e.target.value)}
//               className="w-full p-2 border rounded"
//               placeholder="Enter quiz description"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
//           >
//             {loading ? "Creating..." : "Create Quiz"}
//           </button>
//         </form>
//       </div>

//       {/* Hiển thị lỗi */}
//       {error && (
//         <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
//       )}

//       {/* Hiển thị trạng thái tải */}
//       {loading && !quizzes.length && (
//         <div className="text-gray-600">Loading quizzes...</div>
//       )}

//       {/* Danh sách quiz */}
//       {!loading && quizzes.length === 0 && !error && (
//         <div className="text-gray-600">
//           No quizzes available for this lesson.
//         </div>
//       )}
//       <div className="space-y-4">
//         {quizzes.map((quiz) => (
//           <div
//             key={quiz.quizId}
//             className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
//           >
//             <h4 className="text-lg font-semibold text-gray-800">
//               {quiz.title}
//             </h4>
//             <p className="text-gray-600 mt-2">{quiz.description}</p>
//             <p className="text-sm text-gray-500 mt-1">Type: {quiz.quizType}</p>
//             <button
//               onClick={() => handleTakeQuiz(quiz)}
//               className="mt-2 bg-primary text-white px-3 py-1 rounded hover:bg-indigo-700"
//             >
//               Take Quiz
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Hiển thị câu hỏi khi chọn quiz */}
//       {selectedQuiz && (
//         <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
//           <h4 className="text-xl font-bold text-gray-800 mb-4">
//             {selectedQuiz.title}
//           </h4>
//           {questions.length === 0 && (
//             <p className="text-gray-600">
//               No questions available for this quiz.
//             </p>
//           )}
//           <div className="space-y-6">
//             {questions.map((question, index) => (
//               <div key={index} className="border-b pb-4">
//                 <p className="text-lg font-semibold text-gray-800">
//                   {index + 1}. {question.questionText}
//                 </p>
//                 <div className="mt-2 space-y-2">
//                   {question.options.map((option, i) => (
//                     <label
//                       key={i}
//                       className="flex items-center space-x-2 text-gray-700"
//                     >
//                       <input
//                         type="radio"
//                         name={`question-${index}`}
//                         value={option}
//                         className="form-radio"
//                       />
//                       <span>{option}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//           {questions.length > 0 && (
//             <button
//               onClick={() => setSelectedQuiz(null)}
//               className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//             >
//               Close Quiz
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizList;
