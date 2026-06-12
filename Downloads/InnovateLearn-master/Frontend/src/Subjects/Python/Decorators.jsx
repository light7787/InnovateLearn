import React from 'react';

const Decorators = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8 space-y-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Decorators</h1>

        <p className="text-gray-700 leading-relaxed">Decorators are higher-order functions that wrap other functions to extend or modify behavior. They are widely used for logging, caching, authentication checks, and more.</p>

        <h2 className="text-xl font-semibold text-blue-500">Basic decorator</h2>
        <pre className="bg-gray-100 p-4 rounded">{`def timer(fn):\n    import time\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        res = fn(*args, **kwargs)\n        print('Elapsed', time.time()-start)\n        return res\n    return wrapper\n\n@timer\ndef f():\n    pass`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">Preserve metadata with functools.wraps</h2>
        <p className="text-gray-700">Use <code>functools.wraps</code> to copy function metadata (name, docstring) to the wrapper so tools like inspection and decorators stacking work better.</p>
        <pre className="bg-gray-100 p-4 rounded">{`from functools import wraps\n\ndef timer(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        # ...\n        return fn(*args, **kwargs)\n    return wrapper`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">Chaining decorators</h2>
        <p className="text-gray-700">Multiple decorators apply from bottom to top. Be mindful of the order when combining logging, auth, and caching decorators.</p>

        <h2 className="text-xl font-semibold text-blue-500">Exercise</h2>
        <p className="text-gray-700">Implement a memoize decorator that caches results for pure functions. Then test it on a recursive Fibonacci function and measure the speedup.</p>
      </div>
    </div>
  );
};

export default Decorators;
