import { useEffect, useState } from "react";

import TimerDisplay from "./TimerDisplay";
import Controls from "./Controls";
import SettingsSlideOver from "./SettingsSlideOver";
import useTimer from "../hooks/useTimer";
import useSettings from "../hooks/useSettings";

let settingsVisibilityTimer: ReturnType<typeof setTimeout> | undefined =
  undefined;

function Main() {
  const { isRunning, startTimer, stopTimer, resetTimer, timeLeft } = useTimer();
  const {
    isDarkModeEnabled,
    startTimestamp,
    isTimerOwner,
    stopTimeMilliseconds,
  } = useSettings();

  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Sync timer state from database for both owners and spectators
    // This ensures on page refresh, the timer resumes from where it was
    
    if (startTimestamp && stopTimeMilliseconds === null) {
      // Timer should be running
      if (!isRunning) {
        startTimer();
      }
    } else if (startTimestamp && stopTimeMilliseconds !== null) {
      // Timer should be paused
      if (isRunning) {
        stopTimer();
      }
    } else {
      // Timer has been reset (both null)
      resetTimer();
    }
  }, [startTimestamp, stopTimeMilliseconds, isRunning]);

  useEffect(() => {
    if (isDarkModeEnabled) {
      document.body.classList.add("dark");
      return;
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkModeEnabled]);

  function handleUserActivity() {
    setIsControlsVisible(true);
    clearTimeout(settingsVisibilityTimer);

    if (!isRunning) return;

    settingsVisibilityTimer = setTimeout(
      () => setIsControlsVisible(false),
      5000,
    );
  }

  function handleSettingsClose() {
    setIsSettingsOpen(false);
  }

  function handleSettingsOpen() {
    setIsSettingsOpen(true);
  }

  if (!isTimerOwner) {
    return (
      <div className="flex justify-center items-center bg-background">
        <TimerDisplay timeLeft={timeLeft} />
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center bg-background"
      onMouseMove={handleUserActivity}
    >
      <div>
        <TimerDisplay timeLeft={timeLeft} />
        <Controls
          isControlsVisible={isControlsVisible}
          isRunning={isRunning}
          onStartClick={startTimer}
          onStopClick={stopTimer}
          onResetClick={resetTimer}
          onSettingsOpen={handleSettingsOpen}
        />
      </div>
      <SettingsSlideOver
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
      />
    </div>
  );
}

export default Main;
