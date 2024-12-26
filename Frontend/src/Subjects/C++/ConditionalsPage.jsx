import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ConditionalsPage = () => {
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
          <h1 className="text-4xl font-bold text-blue-600 mb-4">C++ Conditionals</h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Conditional statements in C++ are used to perform different actions based on different conditions.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mb-4">If-Else Statement</h2>
          <p className="text-gray-700 mb-6">
            The `if` statement is used to execute a block of code only if a specified condition is true.
          </p>
          <pre className="bg-gray-800 text-white rounded-lg p-4 overflow-x-auto">
            <code>
              {`
#include <iostream>
using namespace std;

int main() {
    int a = 10;
    if (a > 5) {
        cout << "a is greater than 5" << endl;
    } else {
        cout << "a is less than or equal to 5" << endl;
    }
    return 0;
}
`}
            </code>
          </pre>

          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Switch Case Statement</h2>
          <p className="text-gray-700 mb-6">
            The `switch` statement is used to select one of many code blocks to be executed based on the value of a variable.
          </p>
          <pre className="bg-gray-800 text-white rounded-lg p-4 overflow-x-auto">
            <code>
              {`
#include <iostream>
using namespace std;

int main() {
    int x = 2;
    switch (x) {
        case 1:
            cout << "x is 1" << endl;
            break;
        case 2:
            cout << "x is 2" << endl;
            break;
        default:
            cout << "x is neither 1 nor 2" << endl;
    }
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

export default ConditionalsPage;
