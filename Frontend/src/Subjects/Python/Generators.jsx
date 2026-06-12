import React from 'react';

const Generators = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8 space-y-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Generators</h1>

        <p className="text-gray-700 leading-relaxed">Generators are a simple way to create iterators using <code>yield</code>. They produce items lazily which saves memory for large sequences.</p>

        <h2 className="text-xl font-semibold text-blue-500">Yield example</h2>
        <pre className="bg-gray-100 p-4 rounded">{`def count_up_to(n):\n    i = 0\n    while i < n:\n        yield i\n        i += 1\n\nfor x in count_up_to(5):\n    print(x)`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">Generator expressions</h2>
        <pre className="bg-gray-100 p-4 rounded">{`g = (x*x for x in range(1000000))\n# consumes little memory\nprint(next(g))`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">When to use generators</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Processing streaming data (logs, large files).</li>
          <li>Pipelining transformations where each step consumes the previous generator.</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-500">Pitfalls</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Generators are single-use — once exhausted, they cannot be restarted.</li>
          <li>Be careful mixing generators with code expecting random access (like indexing).</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-500">Exercise</h2>
        <p className="text-gray-700">Create a generator that reads a large log file and yields parsed JSON objects, skipping malformed lines. Then chain it to another generator that filters events by type.</p>
      </div>
    </div>
  );
};

export default Generators;
