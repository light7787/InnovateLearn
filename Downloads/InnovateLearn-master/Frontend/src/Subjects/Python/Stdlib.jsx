import React from 'react';

const Stdlib = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Python Standard Library</h1>
        <p className="text-gray-700">The standard library includes modules like <code>os</code>, <code>sys</code>, <code>json</code>, <code>datetime</code>, and many more for common tasks.</p>
        <pre className="bg-gray-100 p-4 rounded mt-4">{`import os\nprint(os.getcwd())\nimport json\nprint(json.dumps({'a':1}))`}</pre>
      </div>
    </div>
  );
};

export default Stdlib;
