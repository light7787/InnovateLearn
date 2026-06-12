export const questionBank = {
  Basic: [
    {
      question: 'Which keyword is used to define a function in Python?',
      options: ['func', 'def', 'function', 'lambda'],
      correctAnswer: 1,
    },
    {
      question: 'What does `len([1,2,3])` return?',
      options: ['2', '3', '1', 'Error'],
      correctAnswer: 1,
    },
    {
      question: 'Which data structure is immutable?',
      options: ['list', 'tuple', 'dict', 'set'],
      correctAnswer: 1,
    },
    {
      question: 'How do you comment a single line in Python?',
      options: ['// comment', '# comment', '/* comment */', '<!-- comment -->'],
      correctAnswer: 1,
    },
    {
      question: 'Which symbol is used for exponentiation?',
      options: ['^', '**', 'exp()', 'pow'],
      correctAnswer: 1,
    },
  ],
  Medium: [
    {
      question: 'What is a list comprehension?',
      options: ['A function to compress lists', 'A concise way to create lists', 'A type of loop', 'A module'],
      correctAnswer: 1,
    },
    {
      question: 'How do you open a file for appending?',
      options: ["open('f','r')","open('f','w')","open('f','a')","open('f','x')"],
      correctAnswer: 2,
    },
    {
      question: 'What does the `strip()` method do on strings?',
      options: ['Remove whitespace from both ends', 'Split a string', 'Convert to uppercase', 'Trim to fixed length'],
      correctAnswer: 0,
    },
    {
      question: 'Which statement is used to handle exceptions?',
      options: ['try/except', 'if/else', 'switch/case', 'raise/catch'],
      correctAnswer: 0,
    },
    {
      question: 'How to create a set of unique elements?',
      options: ["[]","()","{}","set()"],
      correctAnswer: 3,
    },
  ],
  Advanced: [
    {
      question: 'What does GIL stand for in CPython?',
      options: ['Global Interpreter Lock', 'Global Instantiation Layer', 'General I/O Library', 'Global IO Lock'],
      correctAnswer: 0,
    },
    {
      question: 'Which built-in helps with lazy iteration?',
      options: ['map', 'filter', 'generator expressions', 'list comprehensions'],
      correctAnswer: 2,
    },
    {
      question: 'What does `@staticmethod` do?',
      options: ['Declare a method that receives self', 'Bind method to class, no self parameter', 'Make method private', 'Make method abstract'],
      correctAnswer: 1,
    },
    {
      question: 'Which library is commonly used for data manipulation?',
      options: ['numpy', 'pandas', 'requests', 'flask'],
      correctAnswer: 1,
    },
    {
      question: 'How to create a virtual environment using venv?',
      options: ['python -m venv env', 'venv create env', 'pip install venv', 'virtualenv env'],
      correctAnswer: 0,
    },
  ],
};
