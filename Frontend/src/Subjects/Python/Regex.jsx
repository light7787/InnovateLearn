import React from 'react';

const Regex = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Regular Expressions</h1>
        <p className="text-gray-700">Use the <code>re</code> module for pattern matching.</p>
        <pre className="bg-gray-100 p-4 rounded mt-4">{`import re\npattern = re.compile(r'\d+')\nprint(pattern.findall('abc123def456'))`}</pre>
      </div>
    </div>
  );
};

export default Regex;
