import React from 'react';

const Files = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">File I/O in Python</h1>
        <p className="text-gray-700 leading-relaxed">
          Python provides built-in functions like <code>open</code> to read and write files. Example:
        </p>
        <pre className="bg-gray-100 p-4 rounded mt-4">{`with open('file.txt', 'r') as f:\n    contents = f.read()\n    print(contents)`}</pre>

        <h2 className="text-2xl font-semibold text-blue-500 mt-6 mb-3">Writing to a file</h2>
        <pre className="bg-gray-100 p-4 rounded">{`with open('file.txt', 'w') as f:\n    f.write('Hello')`}</pre>

        <p className="text-gray-700 mt-4">Be mindful of file modes ('r','w','a','rb','wb') and file permissions. Use <code>with</code> to ensure proper resource cleanup.</p>
      </div>
    </div>
  );
};

export default Files;
