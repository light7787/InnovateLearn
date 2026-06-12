import React from 'react';

const Phome = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Python Programming Language Overview</h1>
        <p className="text-gray-700 mb-6">
          <strong>Python</strong> is a high-level, interpreted programming language known for its readability and wide standard library. It's commonly used for web development, data science, scripting, automation, and more.
        </p>

        <h2 className="text-2xl font-semibold text-blue-500 mb-4">Why learn Python?</h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700">
          <li>Readable syntax and fast development</li>
          <li>Large ecosystem of libraries and frameworks</li>
          <li>Great for beginners and advanced users alike</li>
        </ul>

        <p className="text-gray-700">Use the sidebar to navigate topics. This course requires login to access full content and exercises.</p>
      </div>
    </div>
  );
};

export default Phome;
