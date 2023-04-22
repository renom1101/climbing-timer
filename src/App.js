import React from "react";

import Timer from "./components/Timer";

import "./App.css";

function App() {
  return (
    <div>
      <Timer
        climbSeconds={localStorage.getItem("climbSeconds") || undefined}
        preparationSeconds={
          localStorage.getItem("preparationSeconds") || undefined
        }
      />
    </div>
  );
}

export default App;
