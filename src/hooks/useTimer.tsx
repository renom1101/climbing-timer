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

  // Restore frozen state from DB only when paused (not while running —
  // updateTime is the authority for phase and display while the timer ticks)
  useEffect(() => {
    if (stopTimeMilliseconds !== null) {
      setTimeLeft(stopTimeMilliseconds);
      setIsPreparationTime(dbIsPreparationTime);
    }
  }, [stopTimeMilliseconds, dbIsPreparationTime]);

  function updateTime() {
    // Always calculate from startTimestamp (server truth)
    if (!startTimestamp || updatedAtMs === null) return;

    // Use updatedAtMs (server timestamp) as the reference point
    // Add time elapsed since the update was received, using adjusted time
    const currentAdjustedTime = getAdjustedNow();
    const timeSinceUpdate = currentAdjustedTime - updatedAtMs;
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
      if (positionInCycleMs < climbDurationMs) {
        newIsPreparationTime = false;
        displayTime = climbDurationMs - positionInCycleMs;
      } else {
        newIsPreparationTime = true;
        displayTime = prepDurationMs - (positionInCycleMs - climbDurationMs);
      }
    } else {
      newIsPreparationTime = false;
      displayTime = climbDurationMs - positionInCycleMs;
    }

    const phaseChanged = isPreparationEnabled
      ? newIsPreparationTime !== isPreparationTime
      : displayTime >= cycleDurationMs - 50;

    if (phaseChanged && !isCycleFinished) {
      setIsCycleFinished(true);
    } else if (!phaseChanged && isCycleFinished) {
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
      const now = Math.round(getAdjustedNow());
      updateTimerState(now, dbIsPreparationTime, null);
    } else if (startTimestamp && stopTimeMilliseconds !== null) {
      // Resuming from pause: convert display time to elapsed time
      // stopTimeMilliseconds is "time remaining in current phase"
      // We need to convert it to "elapsed time since timer started"
      const climbDurationMs = climbSeconds * 1000;
      const prepDurationMs = preparationSeconds * 1000;
      
      let elapsedAtPause: number;
      if (!isPreparationEnabled) {
        elapsedAtPause = climbDurationMs - stopTimeMilliseconds;
      } else if (isPreparationTime) {
        elapsedAtPause = climbDurationMs + (prepDurationMs - stopTimeMilliseconds);
      } else {
        elapsedAtPause = climbDurationMs - stopTimeMilliseconds;
      }
      
      // Calculate new startTimestamp so that elapsed = now - startTimestamp
      const now = Math.round(getAdjustedNow());
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
