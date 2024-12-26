import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Errors = () => {
  const [show, setShow] = useState(true);

  return (
    <div className="flex">
      <div className="w-64 bg-blue-500 text-white p-6 space-y-4">
        <h1 onClick={() => setShow(!show)} className="text-2xl font-bold mb-8 cursor-pointer">
          C++ Topics
        </h1>
        {show && (
          <div className="overflow-hidden transition-all duration-500">
            <ul className="space-y-2">
            <Link to='/cplusplus/compiler'> <li>C++ Compiler</li></Link>
<Link to='/cplusplus/abstraction'>  <li>Abstraction</li></Link>
<Link to='/cplusplus/array'>  <li>Arrays</li></Link>
<Link to='/cplusplus/classes'>  <li>Classes</li></Link>
<Link to='/cplusplus/comment'> <li>Comments</li></Link>
<Link to='/cplusplus/conditionals'>  <li>Conditionals</li></Link>
<Link to='/cplusplus/constructor'>   <li>Constructors</li></Link>
<Link to='/cplusplus/data-types'> <li>Data Types</li></Link>
<Link to='/cplusplus/deque'> <li>Deque</li></Link>
<Link to='/cplusplus/encapsulation'> <li>Encapsulation</li></Link>
<Link to='/cplusplus/enum'> <li>Enum</li></Link>
<Link to='/cplusplus/errors'> <li>Errors</li></Link>
<Link to='/cplusplus/exceptions'> <li>Exceptions</li></Link>
<Link to='/cplusplus/files'> <li>Files</li></Link>
                  <Link to='/cplusplus/quiz'>
                    <button>Questions</button>
                  </Link>
            </ul>
          </div>
        )}
      </div>
      <div className="min-h-screen bg-gray-100 flex-1 p-6">
        <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">C++ Errors</h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Errors are common in C++ programs. There are three main types: syntax errors, runtime errors, and logical errors.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Types of Errors</h2>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Syntax Errors</strong> - Errors in the program's code structure (e.g., missing semicolon).</li>
            <li><strong>Runtime Errors</strong> - Errors that occur while the program is running (e.g., dividing by zero).</li>
            <li><strong>Logical Errors</strong> - Errors that occur when the program runs but produces incorrect output.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Example Code (Syntax Error)</h2>
          <pre className="bg-gray-800 text-white rounded-lg p-4 overflow-x-auto">
            <code>
              {`
#include <iostream>
using namespace std;

int main() {
    int x = 10;
    cout << "Value of x: " << x << endl // Syntax error: missing semicolon

    return 0;
}
`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Errors;