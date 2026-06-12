import React, { useState } from 'react';
import CodeRunner from '../../Components/CodeRunner';

const topics = [
  'Overview',
  'Accessors',
  'AJAX',
  'Arrays',
  'Arrow Functions',
  'Callbacks',
  'Closures',
  'Comments',
  'Conditionals',
  'Constructors',
  'Data Types',
  'Dates',
  'Errors',
  'Events',
  'Functions',
];

const topicContents = {
  Overview: `JavaScript (JS) is a lightweight interpreted (or just-in-time compiled) programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as Node.js. JavaScript supports multiple paradigms including procedural, object-oriented and functional programming.`,
  Arrays: `Arrays in JavaScript are dynamic lists. They provide methods like push, pop, map, filter, reduce that are commonly used in functional-style programming. Arrays are zero-indexed and can hold mixed types, though using consistent types is recommended for clarity.`,
  'Arrow Functions': `Arrow functions provide a concise syntax for writing functions and they capture the surrounding this value (lexical this). They are ideal for short callbacks and non-method functions, but are not suitable as constructors.`,
  Closures: `Closures are functions that retain access to the lexical scope in which they were defined, even when executed outside that scope. They are commonly used for data privacy and factory functions.`,
  Functions: `Functions in JavaScript are first-class values. They can be assigned to variables, passed to other functions, and returned from functions. JavaScript supports function declarations, function expressions, arrow functions, and async functions.`,
  'Data Types': `Primitives include undefined, null, boolean, number, string, symbol, bigint. Objects and functions are reference types. Understanding value vs. reference semantics is important when working with assignments and function arguments.`,
  AJAX: `AJAX allows asynchronous HTTP requests from the browser using XMLHttpRequest, fetch, or libraries like axios. Modern code typically uses the fetch API with promises or async/await.`,
  Callbacks: `Callbacks are functions passed as arguments to be invoked later; they are a core part of asynchronous patterns. Promises and async/await reduce callback complexity for sequential async work.`,
  Conditionals: `Use if/else, switch for branching logic. Ternary operator offers concise conditional expressions. Always handle edge cases (null/undefined) when checking values.`,
  Comments: `Use // for single-line and /* ... */ for block comments. Write clear comments only when necessary; prefer self-documenting code where possible.`,
  Constructors: `Constructor functions (or class syntax) create object instances. Use new to instantiate when using constructor functions or classes. ES6 class syntax provides a clearer structure over prototype manipulation.`,
  Dates: `The Date object handles date and time values; libraries like date-fns or dayjs help with formatting, timezone handling, and immutability.`,
  Errors: `Errors are thrown with throw and can be caught using try/catch. Use specific error types and provide helpful messages. In async code, handle promise rejections to avoid silent failures.`,
  Events: `DOM events allow interaction handling; event listeners respond to user interactions like clicks and keypresses. Use event delegation for lists of dynamic items to improve performance.`,
  Accessors: `Getters and setters provide computed properties on objects using get and set syntax. They can encapsulate internal state and validation logic.`,
};

const JavascriptSidebar = ({ show, setShow, onSelect, selected }) => {
  return (
    <div className="w-64 bg-blue-500 text-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 onClick={() => setShow(!show)} className="text-2xl font-bold mb-2 cursor-pointer">
          JavaScript Topics
        </h1>
        <button className="md:hidden" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
      </div>
      {show && (
        <ul className="space-y-2">
          {topics.map((t) => (
            <li key={t}>
              <button
                onClick={() => onSelect(t)}
                className={`text-left w-full ${selected === t ? 'font-semibold underline' : ''}`}
              >
                {t}
              </button>
            </li>
          ))}
          <li>
            <a href="/js/quiz" className="inline-block mt-2 bg-white text-blue-600 px-3 py-1 rounded">Questions</a>
          </li>
        </ul>
      )}
    </div>
  );
};

const Javascript = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('Overview');

  const onSelect = (t) => {
    setSelectedTopic(t);
    // update hash for visibility and back button support
    try { window.location.hash = `#${t.replace(/\s+/g, '-').toLowerCase()}`; } catch (e) {}
    // ensure content is visible / scrolled to top of main content
    const el = document.getElementById('js-main');
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64">
        <JavascriptSidebar show={showSidebar} setShow={setShowSidebar} onSelect={onSelect} selected={selectedTopic} />
      </div>

  {/* Main Content */}
  <div id="js-main" className="bg-gray-100 flex-1 p-6 overflow-auto">
        <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">{selectedTopic}</h1>

          <p className="text-gray-700 leading-relaxed">
            {topicContents[selectedTopic] || 'Content for this topic is coming soon. Use the sidebar to pick another topic.'}
          </p>

          {selectedTopic === 'Overview' && (
            <>
              <p className="text-gray-700 leading-relaxed">
                This section is dedicated to the JavaScript language itself, and not the parts that are specific to Web pages or other host environments. For information about APIs that are specific to Web pages, please see Web APIs and DOM.
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
            </>
          )}

          {/* Topic-specific code/examples */}
          {selectedTopic === 'Arrays' && (
            <>
              <pre className="bg-gray-100 p-4 rounded">{`const nums = [1,2,3];\nconst doubled = nums.map(n => n * 2);\nconst evens = nums.filter(n => n % 2 === 0);\nconsole.log(doubled, evens);`}</pre>
              <h3 className="text-lg font-semibold">Try it</h3>
              <CodeRunner initialCode={`const nums = [1,2,3];\nconst doubled = nums.map(n => n * 2);\nconst evens = nums.filter(n => n % 2 === 0);\nconsole.log('doubled=', doubled);\nconsole.log('evens=', evens);`} />
            </>
          )}

          {selectedTopic === 'Closures' && (
            <>
              <pre className="bg-gray-100 p-4 rounded">{`function makeCounter() {\n  let count = 0;\n  return function() {\n    count += 1;\n    return count;\n  }\n}\nconst c = makeCounter();\nconsole.log(c()); // 1\nconsole.log(c()); // 2`}</pre>
              <h3 className="text-lg font-semibold">Try it</h3>
              <CodeRunner initialCode={`function makeCounter() {\n  let count = 0;\n  return function() {\n    count += 1;\n    return count;\n  }\n}\nconst c = makeCounter();\nconsole.log(c());\nconsole.log(c());`} />
            </>
          )}

          {selectedTopic === 'Arrow Functions' && (
            <>
              <pre className="bg-gray-100 p-4 rounded">{`// concise arrow\nconst add = (a, b) => a + b;\n// with body\nconst addVerbose = (a, b) => {\n  const result = a + b;\n  return result;\n};`}</pre>
              <h3 className="text-lg font-semibold">Try it</h3>
              <CodeRunner initialCode={`const add = (a, b) => a + b;\nconsole.log(add(2,3));\nconst addVerbose = (a,b) => { const result = a + b; return result; };\nconsole.log(addVerbose(5,7));`} />
            </>
          )}

          {selectedTopic === 'Callbacks' && (
            <>
              <pre className="bg-gray-100 p-4 rounded">{`function fetchData(cb) {\n  setTimeout(() => cb(null, 'data'), 500);\n}\nfetchData((err, data) => {\n  if (err) return console.error(err);\n  console.log(data);\n});`}</pre>
              <h3 className="text-lg font-semibold">Try it</h3>
              <CodeRunner initialCode={`function fetchData(cb) {\n  setTimeout(() => cb(null, 'data from server'), 300);\n}\nfetchData((err, data) => {\n  if (err) return console.error(err);\n  console.log('received:', data);\n});`} />
            </>
          )}

          {selectedTopic === 'AJAX' && (
            <>
              <pre className="bg-gray-100 p-4 rounded">{`// fetch + async/await\nasync function getUser() {\n  try {\n    const res = await fetch('https://jsonplaceholder.typicode.com/users/1');\n    const user = await res.json();\n    console.log(user);\n  } catch (e) {\n    console.error('Request failed', e);\n  }\n}`}</pre>
              <h3 className="text-lg font-semibold">Try it (note: CORS or network may block requests in the iframe)</h3>
              <CodeRunner initialCode={`(async function(){\n  try{\n    const res = await fetch('https://jsonplaceholder.typicode.com/users/1');\n    const user = await res.json();\n    console.log(user);\n  }catch(e){ console.error('Request failed', e); }\n})();`} />
            </>
          )}

          {selectedTopic === 'Functions' && (
            <>
              <pre className="bg-gray-100 p-4 rounded">{`// first-class functions\nfunction greet(name) { return 'Hi ' + name; }\nconst sayHi = greet;\nconsole.log(sayHi('Ada'));`}</pre>
              <h3 className="text-lg font-semibold">Try it</h3>
              <CodeRunner initialCode={`function greet(name) { return 'Hi ' + name; }\nconst sayHi = greet;\nconsole.log(sayHi('Ada'));`} />
            </>
          )}

          {selectedTopic === 'Data Types' && (
            <>
              <pre className="bg-gray-100 p-4 rounded">{`// primitives vs objects\nlet a = 5;\nlet b = a;\na = 6; // b still 5\nconst obj = { x: 1 };\nconst obj2 = obj;\nobj.x = 2; // obj2.x === 2`}</pre>
              <h3 className="text-lg font-semibold">Try it</h3>
              <CodeRunner initialCode={`let a = 5;\nlet b = a;\na = 6;\nconsole.log('a,b', a, b);\nconst obj = { x: 1 };\nconst obj2 = obj;\nobj.x = 2;\nconsole.log('obj,obj2', obj, obj2);`} />
            </>
          )}

          {selectedTopic === 'Events' && (
            <pre className="bg-gray-100 p-4 rounded">{`document.getElementById('btn').addEventListener('click', (e) => {\n  console.log('clicked', e.target);\n});`}</pre>
          )}

          {selectedTopic === 'Errors' && (
            <pre className="bg-gray-100 p-4 rounded">{`try {\n  throw new Error('boom');\n} catch (err) {\n  console.error(err.message);\n}`}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default Javascript;
