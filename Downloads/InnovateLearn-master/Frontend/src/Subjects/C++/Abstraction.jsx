import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AbstractionPage = () => {
  const [show, setShow] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="min-h-screen bg-gray-100 flex-1 p-6">
        <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">C++ Abstraction</h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Abstraction is one of the four fundamental principles of object-oriented programming.
            It involves hiding implementation details and showing only the essential features of
            the object. This makes programs easier to understand and maintain.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Example of Abstraction</h2>
          <div className="bg-gray-800 text-white rounded-lg p-4 overflow-x-auto mb-6">
            <pre className="text-sm">
              <code>
                {`
#include <iostream>
using namespace std;

class Shape {
protected:
    int width, height;
public:
    void setDimensions(int w, int h) {
        width = w;
        height = h;
    }
    virtual int area() = 0; // Pure virtual function
};

class Rectangle : public Shape {
public:
    int area() override {
        return width * height;
    }
};

int main() {
    Rectangle rect;
    rect.setDimensions(5, 6);
    cout << "Area: " << rect.area() << endl;
    return 0;
}
                `}
              </code>
            </pre>
          </div>

          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Benefits of Abstraction</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li>Hides unnecessary details, reducing complexity.</li>
            <li>Improves code maintainability and readability.</li>
            <li>Facilitates code reuse and modularity.</li>
          </ul>

          <p className="text-gray-700">
            By using abstraction, developers can focus on what an object does rather than how it does it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AbstractionPage;
