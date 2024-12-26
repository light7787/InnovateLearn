import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ConstructorPage = () => {
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
          <h1 className="text-4xl font-bold text-blue-600 mb-4">C++ Constructors</h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            A constructor is a special member function of a class that is called automatically when an object of that class is created.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Default Constructor</h2>
          <p className="text-gray-700 mb-6">
            A default constructor is a constructor that takes no arguments and sets the object to default values.
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

    // Default constructor
    Car() {
        brand = "Toyota";
        year = 2020;
    }

    void display() {
        cout << brand << " " << year << endl;
    }
};

int main() {
    Car car1;  // Default constructor is called here
    car1.display();
    return 0;
}
`}
            </code>
          </pre>

          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Parameterized Constructor</h2>
          <p className="text-gray-700 mb-6">
            A parameterized constructor takes arguments to initialize the object with specific values.
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

    // Parameterized constructor
    Car(string b, int y) {
        brand = b;
        year = y;
    }

    void display() {
        cout << brand << " " << year << endl;
    }
};

int main() {
    Car car1("Honda", 2022);  // Parameterized constructor is called here
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

export default ConstructorPage;
