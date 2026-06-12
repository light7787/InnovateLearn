import React, { useState } from "react";
import { questionBank } from "./data";
import Choose from "../../C++/Quiz/Choose";
import Quiz from "../../C++/Quiz/Quiz";
import Result from "../../C++/Quiz/Result";

const Qhome = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const resetQuiz = () => {
    setDifficulty(null);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 text-white font-sans">
      <h1 className="text-4xl font-bold mb-8">Python Quiz </h1>
      {!difficulty && (
        <Choose
          setDifficulty={setDifficulty}
          subject="Python"
          className="flex flex-col items-center gap-4"
        />
      )}
      {difficulty && !quizCompleted && (
        <Quiz
          questions={questionBank[difficulty]}
          setScore={setScore}
          setQuizCompleted={setQuizCompleted}
          className="w-full max-w-2xl"
        />
      )}
      {quizCompleted && (
        <Result
          score={score}
          totalQuestions={questionBank[difficulty].length}
          resetQuiz={resetQuiz}
          difficulty={difficulty}
          className="w-full max-w-md p-4 bg-white text-gray-800 rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};

export default Qhome;
