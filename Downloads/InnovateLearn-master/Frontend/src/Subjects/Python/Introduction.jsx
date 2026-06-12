import React from 'react';

const Introduction = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Introduction to Python</h1>
        <p className="text-gray-700 leading-relaxed">
          Python is an interpreted, high-level and general-purpose programming language. Its design philosophy emphasizes code readability with its notable use of significant indentation.
          Python supports multiple programming paradigms (procedural, object-oriented, and functional). It ships with a large standard library and has an ecosystem of third-party packages for nearly every domain.
        </p>

        <h2 className="text-2xl font-semibold text-blue-500 mt-6 mb-3">Getting started</h2>
        <p className="text-gray-700 mb-4">Install Python from python.org or use a managed environment like Anaconda. Run scripts with <code>python script.py</code> or use the interactive REPL with <code>python</code>.</p>

        <h2 className="text-2xl font-semibold text-blue-500 mt-6 mb-3">Hello world</h2>
        <pre className="bg-gray-100 p-4 rounded">{`print("Hello, World!")`}</pre>
      </div>
    </div>
  );
};

export default Introduction;
