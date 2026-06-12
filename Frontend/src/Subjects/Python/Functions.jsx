import React from 'react';

const Functions = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8 space-y-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Python Functions</h1>
        <p className="text-gray-700 leading-relaxed">
          Functions are reusable blocks of code defined with <code>def</code> or as <code>lambda</code> expressions. Use docstrings to document behavior and typing hints for clarity.
        </p>

        <h2 className="text-xl font-semibold text-blue-500 mt-4">Basic example & docstrings</h2>
        <pre className="bg-gray-100 p-4 rounded">{`def add(a: int, b: int) -> int:\n    """Return the sum of a and b."""\n    return a + b\n\nprint(add(2,3))`}</pre>

        <h2 className="text-xl font-semibold text-blue-500 mt-4">Argument types</h2>
        <p className="text-gray-700">Functions support positional, keyword, default, varargs (<code>*args</code>) and kwargs (<code>**kwargs</code>). Prefer explicit parameters for readability.</p>
        <pre className="bg-gray-100 p-4 rounded">{`def f(a, b=2, *args, **kwargs):\n    print(a, b, args, kwargs)`}</pre>

        <h2 className="text-xl font-semibold text-blue-500 mt-4">Higher-order functions & best practices</h2>
        <p className="text-gray-700">Functions can accept or return other functions. Use them for factories, decorators, and callbacks. Keep functions short and single-purpose.</p>
        <pre className="bg-gray-100 p-4 rounded">{`def make_multiplier(n):\n    def mult(x):\n        return x * n\n    return mult\n\ndouble = make_multiplier(2)\nprint(double(5))`}</pre>
      </div>
    </div>
  );
};

export default Functions;
