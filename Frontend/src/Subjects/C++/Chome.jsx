import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Chome = () => {
  const [show, setShow] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      {!user ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
            <h1 className="text-2xl font-bold text-blue-600 mb-6">
              You need to be logged in to view this course!
            </h1>
            <p className="text-gray-700 mb-4">
              Please log in to continue learning and accessing the course content.
            </p>
            <Link to='/login'>
              <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                Login here
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-blue-500 text-white p-6 space-y-4">
            <h1 onClick={() => { setShow(!show) }} className="text-2xl font-bold mb-8">C++ Topics</h1>

            {show && (
              <div className='overflow-hidden transition-all duration-500'>
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
              <h1 className="text-4xl font-bold text-blue-600 mb-4">
                C++ Programming Language Overview
              </h1>
              <p className="text-gray-700 mb-6">
                <strong>C++</strong> is a very powerful programming language for
                performance-critical applications that rely on speed and efficient
                memory management...
              </p>

              <h2 className="text-2xl font-semibold text-blue-500 mb-4">History of C++</h2>
              <p className="text-gray-700 mb-6">
                The C++ language was created by <strong>Bjarne Stroustrup</strong>...
              </p>

              <h2 className="text-2xl font-semibold text-blue-500 mb-4">Versions of C++</h2>
              <p className="text-gray-700 mb-4">
                There are many versions of the C++ programming language...
              </p>

              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li><strong>C++98</strong> - First edition.</li>
                <li><strong>C++03</strong> - Second edition.</li>
                <li><strong>C++11</strong> - Third edition.</li>
                <li><strong>C++14</strong> - Fourth edition.</li>
                <li><strong>C++17</strong> - Fifth edition.</li>
              </ul>

              <p className="text-gray-700">
                These versions have many differences, mainly additions to the
                standard library and expansion of APIs...
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chome;
