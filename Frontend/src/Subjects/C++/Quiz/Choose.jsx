import React from "react";

const Choose = ({ setDifficulty }) => {
  return (
    <div className="text-center bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome to the C++ Quiz 
      </h1>
      <h2 className="text-xl text-gray-600 mb-4">Select a Difficulty Level:</h2>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setDifficulty("Basic")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Basic
        </button>
        <button
          onClick={() => setDifficulty("Medium")}
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300"
        >
          Medium
        </button>
        <button
          onClick={() => setDifficulty("Advanced")}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
        >
          Advanced
        </button>
      </div>
    </div>
  );
};

export default Choose;
