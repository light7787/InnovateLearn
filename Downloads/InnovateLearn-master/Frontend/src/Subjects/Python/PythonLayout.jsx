import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const PythonLayout = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location && location.state && location.state.openSidebar) {
      setShow(true);
    }
  }, [location]);

  return (
    <div className="flex">
      <div className="w-64 bg-blue-500 text-white p-6 space-y-4 hidden sm:block">
        <h1 className="text-2xl font-bold mb-2">Python Topics</h1>
        <ul className="space-y-2">
          <Link to="compiler"><li>Python REPL</li></Link>
          <Link to="introduction"><li>Introduction</li></Link>
          <Link to="datatypes"><li>Data Types</li></Link>
          <Link to="conditionals"><li>Conditionals</li></Link>
          <Link to="functions"><li>Functions</li></Link>
          <Link to="files"><li>File I/O</li></Link>
          <Link to="loops"><li>Loops</li></Link>
          <Link to="modules"><li>Modules & Packages</li></Link>
          <Link to="oop"><li>Object-Oriented Programming</li></Link>
          <Link to="exceptions"><li>Exceptions</li></Link>
          <Link to="list-comprehensions"><li>List Comprehensions</li></Link>
          <Link to="generators"><li>Generators</li></Link>
          <Link to="decorators"><li>Decorators</li></Link>
          <Link to="iterators"><li>Iterators</li></Link>
          <Link to="venv"><li>Virtual Environments</li></Link>
          <Link to="stdlib"><li>Standard Library</li></Link>
          <Link to="regex"><li>Regular Expressions</li></Link>
          <Link to="networking"><li>Networking (requests)</li></Link>
          <Link to="quiz">
            <button className="mt-2 bg-white text-blue-600 px-3 py-1 rounded">Questions</button>
          </Link>
        </ul>
      </div>

      <div className="flex-1 p-6">
        <div className="sm:hidden mb-4">
          <button onClick={() => setShow(true)} className="bg-blue-500 text-white px-3 py-2 rounded">Topics</button>
        </div>

        {show && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden">
            <div className="w-64 bg-blue-500 text-white p-6 space-y-4 h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Python Topics</h2>
                <button onClick={() => setShow(false)} className="bg-white text-blue-600 px-2 py-1 rounded">Close</button>
              </div>
              <ul className="space-y-2 overflow-auto">
                <Link to='compiler'><li onClick={() => setShow(false)}>Python REPL</li></Link>
                <Link to='introduction'><li onClick={() => setShow(false)}>Introduction</li></Link>
                <Link to='datatypes'><li onClick={() => setShow(false)}>Data Types</li></Link>
                <Link to='conditionals'><li onClick={() => setShow(false)}>Conditionals</li></Link>
                <Link to='functions'><li onClick={() => setShow(false)}>Functions</li></Link>
                <Link to='files'><li onClick={() => setShow(false)}>File I/O</li></Link>
                <Link to='loops'><li onClick={() => setShow(false)}>Loops</li></Link>
                <Link to='modules'><li onClick={() => setShow(false)}>Modules & Packages</li></Link>
                <Link to='oop'><li onClick={() => setShow(false)}>Object-Oriented Programming</li></Link>
                <Link to='exceptions'><li onClick={() => setShow(false)}>Exceptions</li></Link>
                <Link to='list-comprehensions'><li onClick={() => setShow(false)}>List Comprehensions</li></Link>
                <Link to='generators'><li onClick={() => setShow(false)}>Generators</li></Link>
                <Link to='decorators'><li onClick={() => setShow(false)}>Decorators</li></Link>
                <Link to='iterators'><li onClick={() => setShow(false)}>Iterators</li></Link>
                <Link to='venv'><li onClick={() => setShow(false)}>Virtual Environments</li></Link>
                <Link to='stdlib'><li onClick={() => setShow(false)}>Standard Library</li></Link>
                <Link to='regex'><li onClick={() => setShow(false)}>Regular Expressions</li></Link>
                <Link to='networking'><li onClick={() => setShow(false)}>Networking (requests)</li></Link>
                <Link to='quiz'><li onClick={() => setShow(false)}>Questions</li></Link>
              </ul>
            </div>
          </div>
        )}

        <Outlet />
      </div>
    </div>
  );
};

export default PythonLayout;
