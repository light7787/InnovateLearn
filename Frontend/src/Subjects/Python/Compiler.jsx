import React from 'react';

const Compiler = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Python REPL</h1>
        <p className="text-gray-700 mb-4">This is a placeholder for an embedded Python REPL or an external link to an online sandbox.</p>
        <a href="https://replit.com/~" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Open REPL in new tab</a>
      </div>
    </div>
  );
};

export default Compiler;
