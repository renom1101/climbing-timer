import React from "react";

import Timer from "./components/Timer";

import "./App.css";

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Timer
        climbSeconds={
          parseInt(localStorage.getItem("climbSeconds"), 10) || undefined
        }
        preparationSeconds={
          parseInt(localStorage.getItem("preparationSeconds"), 10) || undefined
        }
      />
    </div>
  );
}

export default App;
