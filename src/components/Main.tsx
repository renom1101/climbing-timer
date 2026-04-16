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
    if (startTimestamp && stopTimeMilliseconds === null) {
      startTimer();
    } else if (startTimestamp && stopTimeMilliseconds !== null) {
      stopTimer();
    } else {
      resetTimer();
    }
  }, [startTimestamp, stopTimeMilliseconds]);

  useEffect(() => {
    if (!isRunning || !navigator.wakeLock) return;
    let wakeLock: WakeLockSentinel | null = null;
    async function acquire() {
      try {
        wakeLock = await navigator.wakeLock.request("screen");
      } catch { /* user navigated away or device doesn't support it */ }
    }
    acquire();
    return () => { wakeLock?.release(); };
  }, [isRunning]);

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
