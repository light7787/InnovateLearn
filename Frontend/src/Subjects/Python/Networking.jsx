import React from 'react';

const Networking = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Networking with requests</h1>
        <p className="text-gray-700">The <code>requests</code> library simplifies HTTP requests in Python.</p>
        <pre className="bg-gray-100 p-4 rounded mt-4">{`import requests\nres = requests.get('https://api.github.com')\nprint(res.status_code)\nprint(res.json())`}</pre>
      </div>
    </div>
  );
};

export default Networking;
