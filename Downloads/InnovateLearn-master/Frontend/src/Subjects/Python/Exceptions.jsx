import React from 'react';

const Exceptions = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8 space-y-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Exceptions in Python</h1>

        <p className="text-gray-700 leading-relaxed">Exceptions are the primary error-handling mechanism. Use <code>try</code>/<code>except</code> to catch errors, <code>finally</code> for cleanup, and <code>raise</code> to signal problems.</p>

        <h2 className="text-xl font-semibold text-blue-500">Basic handling</h2>
        <pre className="bg-gray-100 p-4 rounded">{`try:\n    x = 1/0\nexcept ZeroDivisionError:\n    print('cannot divide')\nfinally:\n    print('cleanup')`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">Catching multiple exceptions</h2>
        <pre className="bg-gray-100 p-4 rounded">{`try:\n    do_something()\nexcept (IOError, OSError) as e:\n    handle(e)\nexcept Exception as e:\n    log(e)\n    raise`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">Custom exceptions</h2>
        <pre className="bg-gray-100 p-4 rounded">{`class ValidationError(Exception):\n    pass\n\ndef validate(x):\n    if not cond(x):\n        raise ValidationError('bad input')`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">Best practices & pitfalls</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Avoid bare <code>except:</code> — catch specific exceptions to avoid hiding bugs.</li>
          <li>Use exceptions for exceptional conditions, not normal control flow.</li>
          <li>Log exceptions with stack traces when debugging (use <code>logging.exception</code>).</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-500">Exercise</h2>
        <p className="text-gray-700">Write a function that reads JSON from a file and returns a default value on JSON parsing errors, while logging the error.</p>
      </div>
    </div>
  );
};

export default Exceptions;
