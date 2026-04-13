import { useEffect, useState } from "react";

import useSettings from "./useSettings";
import useInterval from "./useInterval";
import useSounds from "./useSounds";
import { getAdjustedNow } from "../data/supabase/server-time";

const useTimer = () => {
  const {
    climbSeconds,
    preparationSeconds,
    isPreparationEnabled,
    startTimestamp,
    isPreparationTime: dbIsPreparationTime,
    stopTimeMilliseconds,
    updatedAtMs,
    updateTimerState,
    isTimerOwner,
  } = useSettings();

  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(climbSeconds * 1000);
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  const [isCycleFinished, setIsCycleFinished] = useState(false);

  useSounds(isRunning, timeLeft, isPreparationTime, isCycleFinished);

  useEffect(() => {
    if (isRunning) return;

    resetTimer();
  }, [climbSeconds]);

  // Sync isPreparationTime from database when it changes
  useEffect(() => {
    setIsPreparationTime(dbIsPreparationTime);
  }, [dbIsPreparationTime]);

  // When paused state is loaded from DB, restore frozen display time
  useEffect(() => {
    if (stopTimeMilliseconds !== null) {
      setTimeLeft(stopTimeMilliseconds);
    }
  }, [stopTimeMilliseconds]);

  // When phase changes and timer is running, update database
  useEffect(() => {
    if (!isRunning || !isTimerOwner) return;

    if (isPreparationTime !== dbIsPreparationTime) {
      updateTimerState(startTimestamp, isPreparationTime, null);
    }
  }, [
    isPreparationTime,
    dbIsPreparationTime,
    isRunning,
    isTimerOwner,
    startTimestamp,
    updateTimerState,
  ]);

  function updateTime() {
    // Always calculate from startTimestamp (server truth)
    if (!startTimestamp || updatedAtMs === null) return;

    // Use updatedAtMs (server timestamp) as the reference point
    // Add time elapsed since the update was received
    const currentTime = Date.now();
    const timeSinceUpdate = currentTime - updatedAtMs;
    const elapsedMs = updatedAtMs - startTimestamp + timeSinceUpdate;

    // Determine cycle duration (prep + climb, or just climb if no prep)
    const climbDurationMs = climbSeconds * 1000;
    const prepDurationMs = preparationSeconds * 1000;
    const cycleDurationMs = isPreparationEnabled
      ? climbDurationMs + prepDurationMs
      : climbDurationMs;

    // Find position within the current cycle
    const positionInCycleMs = elapsedMs % cycleDurationMs;

    // Determine current phase
    let newIsPreparationTime = false;
    let displayTime = 0;

    if (isPreparationEnabled) {
      if (positionInCycleMs < prepDurationMs) {
        // In preparation phase
        newIsPreparationTime = true;
        displayTime = prepDurationMs - positionInCycleMs;
      } else {
        // In climbing phase
        newIsPreparationTime = false;
        displayTime = climbDurationMs - (positionInCycleMs - prepDurationMs);
      }
    } else {
      // No prep phase, just climbing
      newIsPreparationTime = false;
      displayTime = climbDurationMs - positionInCycleMs;
    }

    // Check if cycle just finished (displayTime wrapped around)
    const wasCycleFinished = isCycleFinished;
    const isCycleNowFinished = displayTime >= cycleDurationMs - 50; // Small margin for 50ms tick
    
    if (isCycleNowFinished && !wasCycleFinished) {
      setIsCycleFinished(true);
    } else if (!isCycleNowFinished && wasCycleFinished) {
      setIsCycleFinished(false);
    }

    setTimeLeft(displayTime);
    setIsPreparationTime(newIsPreparationTime);
  }

  useInterval(updateTime, isRunning ? 50 : null);

  function startTimer() {
    setIsRunning(true);

    if (!isTimerOwner) {
      return;
    }

    // For owner: only update DB if starting fresh or resuming from pause
    if (!startTimestamp) {
      // New start: set to current time and update DB
      const now = getAdjustedNow();
      updateTimerState(now, dbIsPreparationTime, null);
    } else if (startTimestamp && stopTimeMilliseconds !== null) {
      // Resuming from pause: convert display time to elapsed time
      // stopTimeMilliseconds is "time remaining in current phase"
      // We need to convert it to "elapsed time since timer started"
      const climbDurationMs = climbSeconds * 1000;
      const prepDurationMs = preparationSeconds * 1000;
      
      let elapsedAtPause: number;
      if (!isPreparationEnabled) {
        // No prep phase: elapsed = climbDuration - displayTime
        elapsedAtPause = climbDurationMs - stopTimeMilliseconds;
      } else if (isPreparationTime) {
        // In prep phase: elapsed = prepDuration - displayTime
        elapsedAtPause = prepDurationMs - stopTimeMilliseconds;
      } else {
        // In climb phase: elapsed = prepDuration + (climbDuration - displayTime)
        elapsedAtPause = prepDurationMs + (climbDurationMs - stopTimeMilliseconds);
      }
      
      // Calculate new startTimestamp so that elapsed = now - startTimestamp
      const now = getAdjustedNow();
      const newStartTimestamp = now - elapsedAtPause;
      updateTimerState(newStartTimestamp, isPreparationTime, null);
    }
    // If already running (startTimestamp set, not paused), don't update DB
  }

  function stopTimer() {
    setIsRunning(false);

    if (isTimerOwner) {
      // Owner: save frozen display time to DB
      updateTimerState(startTimestamp, isPreparationTime, timeLeft);
    }
  }

  function resetTimer() {
    setTimeLeft(climbSeconds * 1000);
    setIsPreparationTime(false);
    setIsRunning(false);

    if (isTimerOwner) {
      updateTimerState(null, false, null);
    }
  }

  return {
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    timeLeft,
  };
};

export default useTimer;
