export const questionBank = {
    Basic: [
      {
        question: "What is the size of `int` in C++?",
        options: ["2 bytes", "4 bytes", "8 bytes", "Depends on the compiler"],
        correctAnswer: 1,
      },
      {
        question: "Which header file is used for input and output?",
        options: ["iostream", "stdio.h", "conio.h", "math.h"],
        correctAnswer: 0,
      },
      {
        question: "What does the `cout` keyword do in C++?",
        options: ["Takes input", "Displays output", "Defines a variable", "Ends a program"],
        correctAnswer: 1,
      },
      {
        question: "Which of these is a valid variable name?",
        options: ["2name", "_name", "name@", "name$"],
        correctAnswer: 1,
      },
      {
        question: "What is the result of `10 / 3` in C++?",
        options: ["3.33", "3", "Error", "Depends on the compiler"],
        correctAnswer: 1,
      },
      {
        question: "Which of the following is a loop in C++?",
        options: ["if", "for", "switch", "break"],
        correctAnswer: 1,
      },
      {
        question: "Which keyword is used to declare a constant in C++?",
        options: ["const", "constant", "define", "final"],
        correctAnswer: 0,
      },
      {
        question: "What is the purpose of `#include`?",
        options: [
          "To include standard libraries",
          "To declare variables",
          "To define classes",
          "To execute the program",
        ],
        correctAnswer: 0,
      },
      {
        question: "What is the default value of an uninitialized `int` variable in C++?",
        options: ["0", "Garbage value", "null", "undefined"],
        correctAnswer: 1,
      },
      {
        question: "Which operator is used to access members of a class in C++?",
        options: [".", "::", "->", "&"],
        correctAnswer: 0,
      },
    ],
  
    Medium: [
      {
        question: "What does the `virtual` keyword indicate in C++?",
        options: [
          "A function that can be overridden in a derived class",
          "A function that cannot be overridden",
          "A static function",
          "A function that doesn't exist",
        ],
        correctAnswer: 0,
      },
      {
        question: "What is a pure virtual function?",
        options: [
          "A function with no implementation",
          "A static function",
          "A function that cannot be overridden",
          "A function without a return type",
        ],
        correctAnswer: 0,
      },
      {
        question: "Which type of inheritance is not supported in C++?",
        options: [
          "Multiple inheritance",
          "Hierarchical inheritance",
          "Hybrid inheritance",
          "All are supported",
        ],
        correctAnswer: 3,
      },
      {
        question: "Which operator cannot be overloaded in C++?",
        options: ["+", "=", ".", "::"],
        correctAnswer: 3,
      },
      {
        question: "What is the use of `this` pointer in C++?",
        options: [
          "To refer to the current object",
          "To refer to the base class",
          "To create objects",
          "To destroy objects",
        ],
        correctAnswer: 0,
      },
      {
        question: "Which keyword is used to define a macro?",
        options: ["define", "macro", "const", "static"],
        correctAnswer: 0,
      },
      {
        question: "What is function overloading?",
        options: [
          "Two functions with the same name but different parameters",
          "Two functions with the same name and parameters",
          "A function with no parameters",
          "None of the above",
        ],
        correctAnswer: 0,
      },
      {
        question: "What does `public` inheritance imply?",
        options: [
          "Base class members retain their access specifiers",
          "Private members become protected",
          "Protected members become public",
          "Private members become public",
        ],
        correctAnswer: 0,
      },
      {
        question: "What does `delete` operator do in C++?",
        options: [
          "Deallocates memory",
          "Deletes files",
          "Destroys variables",
          "None of the above",
        ],
        correctAnswer: 0,
      },
      {
        question: "What is the output of `sizeof(char)`?",
        options: ["1", "2", "4", "Depends on the compiler"],
        correctAnswer: 0,
      },
    ],
  
    Advanced: [
      {
        question: "Which feature of OOP is indicated by overloading operators?",
        options: ["Encapsulation", "Abstraction", "Polymorphism", "Inheritance"],
        correctAnswer: 2,
      },
      {
        question: "What does the term 'RAII' stand for in C++?",
        options: [
          "Resource Allocation Is Initialization",
          "Resource Allocation Inheritance Interface",
          "Runtime Abstraction Is Immutable",
          "Resource Abstraction Is Initialization",
        ],
        correctAnswer: 0,
      },
      {
        question: "What does `std::move` do in C++?",
        options: [
          "Performs a move operation",
          "Creates a copy of the object",
          "Allocates memory dynamically",
          "Deletes memory",
        ],
        correctAnswer: 0,
      },
      {
        question: "What is the main purpose of `std::unique_ptr`?",
        options: [
          "To manage unique ownership of a dynamically allocated object",
          "To share ownership of an object",
          "To create pointers",
          "To manage memory in arrays",
        ],
        correctAnswer: 0,
      },
      {
        question: "Which C++11 feature allows you to write `auto x = 10;`?",
        options: ["Type inference", "Type casting", "Type erasure", "Type narrowing"],
        correctAnswer: 0,
      },
      {
        question: "What is the time complexity of `std::map` operations?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        correctAnswer: 1,
      },
      {
        question: "Which template is used for fixed-size arrays in C++?",
        options: ["std::array", "std::vector", "std::deque", "std::list"],
        correctAnswer: 0,
      },
      {
        question: "What is the output of `std::cout << 'A' + 1;`?",
        options: ["B", "66", "A1", "Compiler Error"],
        correctAnswer: 1,
      },
      {
        question: "Which feature ensures a class can have only one instance?",
        options: ["Singleton Pattern", "Static Methods", "Inheritance", "RAII"],
        correctAnswer: 0,
      },
      {
        question: "What does the keyword `explicit` prevent?",
        options: [
          "Implicit conversions",
          "Overloading",
          "Virtual functions",
          "Dynamic memory allocation",
        ],
        correctAnswer: 0,
      },
    ],
  };
  