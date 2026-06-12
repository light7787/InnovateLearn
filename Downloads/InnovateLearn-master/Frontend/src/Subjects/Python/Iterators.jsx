import React from 'react';

const Iterators = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8 space-y-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Iterators</h1>

        <p className="text-gray-700 leading-relaxed">Iterators implement the iterator protocol: an object with <code>__iter__</code> (returns self) and <code>__next__</code> (returns next value or raises <code>StopIteration</code>).</p>

        <h2 className="text-xl font-semibold text-blue-500">Using iter() and next()</h2>
        <pre className="bg-gray-100 p-4 rounded">{`it = iter([1,2,3])\nprint(next(it))\nprint(next(it))`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">Implementing a custom iterator</h2>
        <pre className="bg-gray-100 p-4 rounded">{`class Count:\n    def __init__(self, limit):\n        self.i = 0\n        self.limit = limit\n    def __iter__(self):\n        return self\n    def __next__(self):\n        if self.i >= self.limit:\n            raise StopIteration\n        val = self.i\n        self.i += 1\n        return val\n\nfor x in Count(3):\n    print(x)`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">Iterables vs Iterators</h2>
        <p className="text-gray-700">An iterable returns a fresh iterator from <code>__iter__</code>. A list is iterable — calling <code>iter(list)</code> returns a new iterator each time. Iterators are single-use.</p>

        <h2 className="text-xl font-semibold text-blue-500">Exercise</h2>
        <p className="text-gray-700">Implement an iterator that yields prime numbers up to N. Optionally, cache primes found so far to avoid repeated expensive checks.</p>
      </div>
    </div>
  );
};

export default Iterators;
