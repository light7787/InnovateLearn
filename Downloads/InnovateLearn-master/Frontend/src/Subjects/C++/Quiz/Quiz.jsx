import React, { useState } from "react";

const Quiz = ({ questions, setScore, setQuizCompleted }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleNext = () => {
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setSelectedOption(null);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="quiz bg-white p-6 rounded-lg shadow-lg w-full max-w-xl mx-auto text-gray-800">
      <h2 className="text-xl font-bold mb-4">
        Question {currentQuestionIndex + 1}/{questions.length}
      </h2>
      <p className="mb-6">{questions[currentQuestionIndex].question}</p>
      <div className="grid gap-4 mb-6">
        {questions[currentQuestionIndex].options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(index)}
            className={`py-2 px-4 rounded text-white font-medium transition duration-300 ${
              selectedOption === index
                ? "bg-blue-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={selectedOption === null}
        className={`py-2 px-6 rounded font-medium transition duration-300 ${
          selectedOption === null
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
        {currentQuestionIndex + 1 === questions.length ? "Finish" : "Next"}
      </button>
    </div>
  );
};

export default Quiz;
