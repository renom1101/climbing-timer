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
    climbSeconds,
    startTimestamp,
    isTimerOwner,
    stopTimestamp,
  } = useSettings();

  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  function reduceTime(time: number): number {
    return time < climbSeconds * 1000
      ? time
      : reduceTime(time - climbSeconds * 1000);
  }

  useEffect(() => {
    // Only sync state from database for spectators (non-owners)
    // Owners control the timer directly via buttons
    if (isTimerOwner) return;

    // Spectators: sync timer state from database timestamps
    if (startTimestamp && !stopTimestamp) {
      const timePassed = reduceTime(Date.now() - startTimestamp);
      startTimer(timePassed);
    } else if (startTimestamp && stopTimestamp) {
      const timePassed = reduceTime(stopTimestamp - startTimestamp);
      stopTimer(timePassed);
    }
  }, [startTimestamp, stopTimestamp, isTimerOwner]);

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
