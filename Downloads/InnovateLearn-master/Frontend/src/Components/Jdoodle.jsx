

import React, { useEffect } from "react";

const Jdoodle = () => {
  useEffect(() => {
    // Dynamically load JDoodle's script
    const script = document.createElement("script");
    script.src = "https://www.jdoodle.com/assets/jdoodle-pym.min.js";
    script.type = "text/javascript";
    document.body.appendChild(script);
  }, []); // Run once when the component mounts

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>C++ Online Compiler</h1>
      <div
        data-pym-src="https://www.jdoodle.com/embed/v1/561978484f3690a9"
        style={{ margin: "20px auto", maxWidth: "800px" }}
      ></div>
    </div>
  );
};

export default Jdoodle;
