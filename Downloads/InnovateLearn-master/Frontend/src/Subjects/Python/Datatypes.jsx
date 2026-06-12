import React from 'react';

const Datatypes = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8 space-y-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Python Data Types</h1>

        <p className="text-gray-700 leading-relaxed">
          Python's built-in types include numbers (int, float, complex), strings, sequences (list, tuple, range), mappings (dict), sets, and booleans. Choosing the right type affects performance and behavior (especially mutability and copy semantics).
        </p>

        <h2 className="text-xl font-semibold text-blue-500 mt-4">Mutability and copies</h2>
        <p className="text-gray-700">Lists and dictionaries are mutable — modifying them in-place changes the original object. Tuples and strings are immutable. Beware of unintentionally sharing references:</p>
        <pre className="bg-gray-100 p-4 rounded">{`a = [1,2,3]\nb = a\na.append(4)\nprint(b)  # b sees the change\n# copy to avoid sharing\nc = a.copy()`}</pre>

        <h2 className="text-xl font-semibold text-blue-500 mt-4">Lists vs Tuples</h2>
        <p className="text-gray-700">Use tuples for fixed collections (predictable, slightly faster) and lists for mutable sequences.</p>
        <pre className="bg-gray-100 p-4 rounded">{`# list (mutable)\nnums = [1,2,3]\nnums.append(4)\n# tuple (immutable)\npt = (1,2,3)`}</pre>

        <h2 className="text-xl font-semibold text-blue-500 mt-4">Dictionaries (mappings)</h2>
        <p className="text-gray-700">Dictionaries map keys to values and are great for lookups. Use `.get()` to avoid KeyError and consider `defaultdict` or dataclasses for structured data.</p>
        <pre className="bg-gray-100 p-4 rounded">{`person = { 'name': 'Ada', 'age': 30 }\nprint(person.get('email', 'not set'))`}</pre>

        <h2 className="text-xl font-semibold text-blue-500 mt-4">Performance tips</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Use lists for ordered collections you mutate frequently.</li>
          <li>Use sets for membership checks (O(1) avg time).</li>
          <li>Prefer generator expressions for large sequences to save memory.</li>
        </ul>
      </div>
    </div>
  );
};

export default Datatypes;
