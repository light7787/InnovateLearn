import React, { useEffect } from "react";



const Result = ({ score, totalQuestions, resetQuiz,difficulty }) => {
  // Get the user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const email = user ? user.email : null;  // Extract email from the user object


  useEffect(() => {
    if (score > 2) {
      addBadgeToUser();
    }
  }, [score]);

  const badge =
  difficulty === "basic"
    ? "C++ Quiz Basic Master"
    : difficulty === "medium"
    ? "C++ Quiz Medium Master"
    : difficulty === "hard"
    ? "C++ Quiz Hard Master"
    : "C++ Quiz Participant";

  const addBadgeToUser = async () => {
    if (!email) {
      console.error("User not found in localStorage.");
      return;
    }

    try {
      const response = await fetch("https://innovate-learn-v1ki.vercel.app/api/addbadge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,   // Use email here
          badge,
        }),
      });

      if (response.ok) {
        console.log("Badge added successfully!");
      } else {
        console.error("Failed to add badge:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to add badge:", error);
    }
  };

  return (
    <div className="result bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>
      <p className="text-lg text-gray-700 mb-6">
        Your Score:{" "}
        <span className="font-bold text-green-600">
          {score}/{totalQuestions}
        </span>
      </p>
      {score > 2&& (
        <p className="text-lg font-medium text-blue-500 mb-6">
          Congratulations! You earned the "C++ {difficulty} Quiz Master" badge!
        </p>
      )}
      <button
        onClick={resetQuiz}
        className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Try Again
      </button>
    </div>
  );
};

export default Result;
