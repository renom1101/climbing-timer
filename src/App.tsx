import { useState } from "react";

import Timer from "./components/Timer";

let settingsVisibilityTimer: number | undefined = undefined;

function App() {
  const [climbSeconds, setClimbSeconds] = useState(
    parseInt(localStorage.getItem("climbSeconds") || "", 10) || 270
  );
  const [preparationSeconds, setPreparationSeconds] = useState(
    parseInt(localStorage.getItem("preparationSeconds") || "", 10) || 15
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);

  function handleUserActivity() {
    setIsControlsVisible(true);
    clearTimeout(settingsVisibilityTimer);

    if (!isTimerRunning) return;

    settingsVisibilityTimer = setTimeout(
      () => setIsControlsVisible(false),
      5000
    );
  }

  function handleStartTimer() {
    setIsTimerRunning(true);
  }

  function handleStopTimer() {
    setIsTimerRunning(false);
  }

  function updateClimbTime(newClimbSeconds: number) {
    setClimbSeconds(newClimbSeconds);
  }

  function updatePreparationTime(newPreparationSeconds: number) {
    setPreparationSeconds(newPreparationSeconds);
  }

  return (
    <div
      className="flex justify-center items-center"
      onMouseMove={handleUserActivity}
    >
      <Timer
        climbSeconds={climbSeconds}
        preparationSeconds={preparationSeconds}
        isRunning={isTimerRunning}
        isControlsVisible={isControlsVisible}
        onStart={handleStartTimer}
        onStop={handleStopTimer}
        updateClimbTime={updateClimbTime}
        updatePreparationTime={updatePreparationTime}
      />
    </div>
  );
}

export default App;
