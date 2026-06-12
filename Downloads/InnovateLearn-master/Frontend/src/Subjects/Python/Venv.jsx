import React from 'react';

const Venv = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Virtual Environments (venv)</h1>
        <p className="text-gray-700">Use virtual environments to isolate project dependencies. Create one with <code>python -m venv env</code> and activate it.</p>
        <pre className="bg-gray-100 p-4 rounded mt-4">{`python -m venv env\n# On macOS/Linux\nsource env/bin/activate\n# On Windows\nenv\n`}</pre>
      </div>
    </div>
  );
};

export default Venv;
