import React, { useState, useRef } from 'react';

const template = (userCode) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>body{font-family:system-ui, Arial; padding:12px;}</style>
  </head>
  <body>
    <div id="output" style="white-space:pre-wrap;font-family:monospace;background:#f6f8fa;padding:8px;border-radius:6px;min-height:40px"></div>
    <script>
      (function(){
        const out = document.getElementById('output');
        function write() { for (let i=0;i<arguments.length;i++){ out.innerText += arguments[i] + ' '; } out.innerText += '\n'; }
        console.log = function(){ write.apply(null, arguments); };
        console.error = function(){ write('ERROR:', ...arguments); };
        window.onerror = function(msg, src, line){ write('ERROR:', msg + ' at ' + line); };
        try {
          ${userCode}
        } catch (e) { write('ERROR:', e && e.message ? e.message : e); }
      })();
    <\/script>
  </body>
</html>
`;

const CodeRunner = ({ initialCode }) => {
  const [code, setCode] = useState(initialCode || '// write JS here\nconsole.log("hello world")');
  const [srcDoc, setSrcDoc] = useState(template(code));
  const iframeRef = useRef(null);

  const run = () => {
    setSrcDoc(template(code));
    // small delay to ensure iframe updates
    setTimeout(() => {
      if (iframeRef.current) iframeRef.current.contentWindow && iframeRef.current.focus();
    }, 50);
  };

  return (
    <div className="space-y-3">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full p-3 border rounded-md font-mono text-sm"
        rows={8}
      />
      <div className="flex gap-2">
        <button onClick={run} className="bg-blue-500 text-white px-4 py-2 rounded">Run</button>
        <button onClick={() => setCode(initialCode || '')} className="bg-gray-200 px-3 py-2 rounded">Reset</button>
      </div>
      <iframe title="code-runner" ref={iframeRef} srcDoc={srcDoc} sandbox="allow-scripts" className="w-full h-40 border rounded" />
    </div>
  );
};

export default CodeRunner;
