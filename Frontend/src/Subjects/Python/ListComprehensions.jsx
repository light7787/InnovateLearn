import React from 'react';

const ListComprehensions = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">List Comprehensions</h1>
        <p className="text-gray-700">List comprehensions provide a concise way to create lists from iterables.</p>
        <pre className="bg-gray-100 p-4 rounded mt-4">{`squares = [x*x for x in range(10) if x%2==0]\nprint(squares)`}</pre>
      </div>
    </div>
  );
};

export default ListComprehensions;
