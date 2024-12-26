import React, { useState } from 'react';

const JavascriptSidebar = ({ show, setShow }) => {
  return (
    <div className="w-64 bg-blue-500 text-white p-6 space-y-4">
      <h1 onClick={() => setShow(!show)} className="text-2xl font-bold mb-8 cursor-pointer">
        JavaScript Topics
      </h1>
      {show && (
        <ul className="space-y-2">
          <li>Accessors</li>
          <li>AJAX</li>
          <li>Arrays</li>
          <li>Arrow Functions</li>
          <li>Bitwise Operators</li>
          <li>Callbacks</li>
          <li>Closures</li>
          <li>Comments</li>
          <li>Conditionals</li>
          <li>Constructors</li>
          <li>Data Types</li>
          <li>Dates</li>
          <li>Enums</li>
          <li>Errors</li>
          <li>Events</li>
          <li>Functions</li>
        </ul>
      )}
    </div>
  );
};

const Javascript = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <JavascriptSidebar show={showSidebar} setShow={setShowSidebar} />

      {/* Main Content */}
      <div className="min-h-screen bg-gray-100 flex-1 p-6">
        <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">JavaScript Overview</h1>

          <p className="text-gray-700 leading-relaxed">
            <strong>JavaScript (JS)</strong> is a lightweight interpreted (or just-in-time compiled) programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as Node.js, Apache CouchDB, and Adobe Acrobat. JavaScript is a prototype-based, multi-paradigm, single-threaded, dynamic language, supporting object-oriented, imperative, and declarative (e.g., functional programming) styles.
          </p>

          <p className="text-gray-700 leading-relaxed">
            JavaScript's dynamic capabilities include runtime object construction, variable parameter lists, function variables, dynamic script creation (via <code>eval</code>), object introspection (via <code>for...in</code> and Object utilities), and source-code recovery (JavaScript functions store their source text and can be retrieved through <code>toString()</code>).
          </p>

          <p className="text-gray-700 leading-relaxed">
            This section is dedicated to the JavaScript language itself, and not the parts that are specific to Web pages or other host environments. For information about APIs that are specific to Web pages, please see Web APIs and DOM.
          </p>

          <p className="text-gray-700 leading-relaxed">
            The standards for JavaScript are the ECMAScript Language Specification (ECMA-262) and the ECMAScript Internationalization API specification (ECMA-402). As soon as one browser implements a feature, we try to document it. This means that cases where some proposals for new ECMAScript features have already been implemented in browsers, documentation, and examples in MDN articles may use some of those new features. Most of the time, this happens between the stages 3 and 4, and is usually before the spec is officially published.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Do not confuse JavaScript with the Java programming language — JavaScript is not "Interpreted Java". Both "Java" and "JavaScript" are trademarks or registered trademarks of Oracle in the U.S. and other countries. However, the two programming languages have very different syntax, semantics, and use.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mt-6 mb-4">JavaScript Core Features</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>First-class functions</li>
            <li>Prototype-based inheritance</li>
            <li>Dynamic typing</li>
            <li>Event-driven programming</li>
            <li>Asynchronous programming with promises and async/await</li>
          </ul>

          <p className="text-gray-700 leading-relaxed">
            For more information about JavaScript specifications and related technologies, see the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" className="text-blue-500 hover:underline">JavaScript technologies overview</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Javascript;
