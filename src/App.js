import React from "react";

import Timer from "./components/Timer";

import "./App.css";

function App() {
  return (
    <div>
      <Timer
        initialSeconds={localStorage.getItem("initialSeconds") || undefined}
      />
    </div>
  );
}

export default App;
