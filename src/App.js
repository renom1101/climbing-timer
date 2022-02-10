import { useState, useEffect, useMemo } from "react";

import Timer from "./components/Timer";

import "./App.css";

function App() {
  return (
    <div>
      <Timer initialMinute={0} initialSeconds={15} />
    </div>
  );
}

export default App;
