export const questionBank = {
  Basic: [
    {
      question: 'What is the output of `console.log(typeof [])`?',
      options: ['"array"', '"object"', '"list"', '"undefined"'],
      correctAnswer: 1,
    },
    {
      question: 'Which method creates a new array with the results of calling a function on every element?',
      options: ['filter', 'map', 'reduce', 'forEach'],
      correctAnswer: 1,
    },
    {
      question: 'How do you create a new Promise?',
      options: ['new Promise()', 'Promise.create()', 'Promise.new()', 'create Promise()'],
      correctAnswer: 0,
    },
    {
      question: 'Which operator is used for strict equality?',
      options: ['==', '=', '===', '!=='],
      correctAnswer: 2,
    },
    {
      question: 'Which keyword declares a block-scoped variable?',
      options: ['var', 'let', 'const', 'both let and const'],
      correctAnswer: 3,
    },
  ],
  Medium: [
    {
      question: 'What does closure allow you to do?',
      options: ['Access variables from another function scope', 'Return multiple values', 'Use arrow functions only', 'None of the above'],
      correctAnswer: 0,
    },
    {
      question: 'Which array method reduces the array to a single value?',
      options: ['map', 'filter', 'forEach', 'reduce'],
      correctAnswer: 3,
    },
    {
      question: 'What will `this` refer to in an arrow function used as a method?',
      options: ['The object owning the method', 'Undefined', 'The lexical this (not the object)', 'A new object'],
      correctAnswer: 2,
    },
    {
      question: 'How to handle asynchronous code more readably than callbacks?',
      options: ['Promises', 'Synchronous functions', 'eval', 'setTimeout'],
      correctAnswer: 0,
    },
    {
      question: 'Which of these will NOT mutate the original array?',
      options: ['push', 'splice', 'slice', 'unshift'],
      correctAnswer: 2,
    },
  ],
  Advanced: [
    {
      question: 'What is event delegation?',
      options: ['Adding many listeners to each child', 'Using a single listener on a parent to handle events from children', 'Delegating to web workers', 'None of the above'],
      correctAnswer: 1,
    },
    {
      question: 'What does the `bind` method return?',
      options: ['A new function with bound this', 'The same function', 'Undefined', 'An error'],
      correctAnswer: 0,
    },
    {
      question: 'What is the purpose of `async` keyword?',
      options: ['Make a function synchronous', 'Allow use of await inside the function', 'Improve performance automatically', 'Block the event loop'],
      correctAnswer: 1,
    },
    {
      question: 'What is a Symbol in JavaScript?',
      options: ['A unique and immutable primitive', 'A type of error', 'A deprecated feature', 'A kind of function'],
      correctAnswer: 0,
    },
    {
      question: 'Which feature helps avoid callback hell?',
      options: ['Promises and async/await', 'Using var', 'Global variables', 'Strict mode'],
      correctAnswer: 0,
    },
  ],
};
