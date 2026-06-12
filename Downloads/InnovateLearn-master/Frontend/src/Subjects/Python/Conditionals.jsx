import React from 'react';

const Conditionals = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8 space-y-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Python Conditionals</h1>

        <p className="text-gray-700 leading-relaxed">Conditionals control flow. Use <code>if</code>, <code>elif</code>, and <code>else</code> to branch based on boolean expressions.</p>

        <h2 className="text-xl font-semibold text-blue-500">Basic example</h2>
        <pre className="bg-gray-100 p-4 rounded">{`x = 10\nif x > 0:\n    print('positive')\nelif x == 0:\n    print('zero')\nelse:\n    print('negative')`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">Truthiness</h2>
        <p className="text-gray-700">Python evaluates many values as truthy or falsy. Empty sequences, 0, and None are falsy. Prefer explicit comparisons when intent matters.</p>
        <pre className="bg-gray-100 p-4 rounded">{`# truthy check\nif items:\n    process(items)\n# explicit check is clearer for intent\nif len(items) > 0:\n    process(items)`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">Common pitfalls</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Don't use <code>is</code> to compare values; <code>is</code> checks identity (use <code>==</code> for equality).</li>
          <li>Avoid long nested if/else chains — break logic into functions or use lookup tables/dicts.</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-500">Ternary / conditional expression</h2>
        <pre className="bg-gray-100 p-4 rounded">{`result = 'even' if x % 2 == 0 else 'odd'`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">Pattern matching (Python 3.10+)</h2>
        <p className="text-gray-700">Modern Python has the <code>match</code> statement for structured pattern matching — useful for parsing structured data.</p>
        <pre className="bg-gray-100 p-4 rounded">{`match command:\n    case ['move', x, y]:\n        handle_move(x, y)\n    case {'type': 'draw', 'shape': shape}:\n        draw(shape)`}</pre>

        <h2 className="text-xl font-semibold text-blue-500">Exercise</h2>
        <p className="text-gray-700">Write a function <code>grade(score)</code> that returns 'A'/'B'/'C'/'D'/'F' using conditionals. Try to make it readable and test edge cases (100, 0).</p>
      </div>
    </div>
  );
};

export default Conditionals;
