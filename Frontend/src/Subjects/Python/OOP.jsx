import React from 'react';

const OOP = () => {
  return (
    <div className="bg-gray-100 p-6">
          <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8 space-y-4">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Object Oriented Programming (OOP)</h1>
            <p className="text-gray-700 leading-relaxed">
              Python's OOP model uses classes to encapsulate data and behavior. Use composition over inheritance when possible, and keep methods small and cohesive.
            </p>

            <h2 className="text-xl font-semibold text-blue-500 mt-4">Basic class example</h2>
            <pre className="bg-gray-100 p-4 rounded">{`class Person:\n    def __init__(self, name: str, age: int = 0):\n        self.name = name\n        self.age = age\n\n    def greet(self) -> None:\n        print(f"Hi, I'm {self.name} and I'm {self.age} years old")\n\np = Person('Alice', 30)\np.greet()`}</pre>

            <h2 className="text-xl font-semibold text-blue-500 mt-4">Inheritance & method overriding</h2>
            <pre className="bg-gray-100 p-4 rounded">{`class Employee(Person):\n    def __init__(self, name, age, role):\n        super().__init__(name, age)\n        self.role = role\n\n    def greet(self):\n        print(f"Hi, I'm {self.name}, I work as a {self.role}")\n\ne = Employee('Bob', 28, 'Developer')\ne.greet()`}</pre>

            <h2 className="text-xl font-semibold text-blue-500 mt-4">Exercises</h2>
            <ol className="list-decimal list-inside text-gray-700">
              <li>Create a <code>BankAccount</code> class with deposit, withdraw, and a balance property.</li>
              <li>Implement a <code>Shape</code> base class and derive <code>Circle</code> and <code>Rectangle</code> with an area method.</li>
            </ol>
          </div>
    </div>
  );
};

export default OOP;
