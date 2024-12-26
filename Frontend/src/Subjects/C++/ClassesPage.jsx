import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ClassesPage = () => {
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
          <h1 className="text-4xl font-bold text-blue-600 mb-4">C++ Classes</h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Classes in C++ are user-defined data types that act as templates for objects.
          </p>
          <pre className="bg-gray-800 text-white rounded-lg p-4 overflow-x-auto">
            <code>
              {`
#include <iostream>
using namespace std;

class Car {
public:
    string brand;
    int year;

    void display() {
        cout << brand << " " << year << endl;
    }
};

int main() {
    Car car1;
    car1.brand = "Toyota";
    car1.year = 2020;
    car1.display();
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

export default ClassesPage;
