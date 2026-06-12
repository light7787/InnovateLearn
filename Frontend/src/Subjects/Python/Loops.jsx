import React from 'react';

const Loops = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8 space-y-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Loops in Python</h1>

        <p className="text-gray-700 leading-relaxed">Use <code>for</code> for iterating over iterables and <code>while</code> for condition-driven loops. Python's for-loop is iterator-based (no index arithmetic needed most of the time).</p>

        <h2 className="text-xl font-semibold text-blue-500">For loop & range</h2>
        <pre className="bg-gray-100 p-4 rounded">{`for i in range(5):\n    print(i)\n\n# iterate over list\nfor name in ['a','b','c']:\n    print(name)`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">Useful patterns: enumerate, zip</h2>
        <pre className="bg-gray-100 p-4 rounded">{`for idx, value in enumerate(lst, start=1):\n    print(idx, value)\n\nfor a, b in zip(list1, list2):\n    print(a, b)`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">While loops and control flow</h2>
        <pre className="bg-gray-100 p-4 rounded">{`count = 0\nwhile count < 5:\n    if count == 3:\n        count += 1\n        continue\n    print(count)\n    count += 1`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">Performance & pitfalls</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Avoid modifying a list while iterating over it — iterate over a copy or build a new list.</li>
          <li>Prefer comprehensions or generator expressions for simple transformations — they are concise and often faster.</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-500">Exercise</h2>
        <p className="text-gray-700">Write a loop that merges two lists into a list of tuples and then creates a dictionary from those pairs. Try both <code>zip</code> and a dictionary comprehension.</p>
      </div>
    </div>
  );
};

export default Loops;
