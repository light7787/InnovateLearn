import React from 'react';

const Modules = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8 space-y-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Modules & Packaging</h1>
        <p className="text-gray-700 leading-relaxed">Use modules to organize code into files and packages (directories with <code>__init__.py</code>). Prefer absolute imports for clarity in larger projects.</p>

        <h2 className="text-xl font-semibold text-blue-500 mt-4">Import styles</h2>
        <pre className="bg-gray-100 p-4 rounded">{`# a.py\nPI = 3.14\n\n# b.py\nfrom a import PI\nprint(PI)\n\n# or absolute\nfrom mypackage.utils.a import PI`}</pre>

        <h2 className="text-xl font-semibold text-blue-500 mt-4">Packaging tips</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Keep modules small and focused.</li>
          <li>Use <code>if __name__ == '__main__'</code> for module-level scripts.</li>
          <li>Use a virtual environment and publish packages with a <code>pyproject.toml</code> or <code>setup.py</code>.</li>
        </ul>
      </div>
    </div>
  );
};

export default Modules;
