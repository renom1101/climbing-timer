import { useCallback, useEffect, useRef, useState } from "react";

import TimerDisplay from "./TimerDisplay";
import Controls from "./Controls";
import SettingsSlideOver from "./SettingsSlideOver";
import useTimer from "../hooks/useTimer";
import useSettings from "../hooks/useSettings";

function Main() {
  const { isRunning, startTimer, stopTimer, resetTimer, timeLeft } = useTimer();
  const { isDarkModeEnabled, isTimerOwner } = useSettings();

  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const controlsVisibilityTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearControlsVisibilityTimer = useCallback(() => {
    if (!controlsVisibilityTimerRef.current) return;
    clearTimeout(controlsVisibilityTimerRef.current);
    controlsVisibilityTimerRef.current = null;
  }, []);

  const scheduleControlsHide = useCallback(() => {
    clearControlsVisibilityTimer();
    controlsVisibilityTimerRef.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 5000);
  }, [clearControlsVisibilityTimer]);

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

  useEffect(() => {
    if (!isRunning) {
      setIsControlsVisible(true);
      clearControlsVisibilityTimer();
      return;
    }

    scheduleControlsHide();

    return () => {
      clearControlsVisibilityTimer();
    };
  }, [clearControlsVisibilityTimer, isRunning, scheduleControlsHide]);

  function handleUserActivity() {
    setIsControlsVisible(true);
    if (!isRunning) {
      clearControlsVisibilityTimer();
      return;
    }

    scheduleControlsHide();
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
      onPointerDown={handleUserActivity}
      onPointerMove={handleUserActivity}
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
