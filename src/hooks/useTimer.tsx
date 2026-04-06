import { useEffect, useState } from "react";

import useSettings from "./useSettings";
import useInterval from "./useInterval";
import useSounds from "./useSounds";

const useTimer = () => {
  const {
    climbSeconds,
    preparationSeconds,
    isPreparationEnabled,
    startTimestamp,
    isPreparationTime: dbIsPreparationTime,
    stopTimeMilliseconds,
    updateTimerState,
    isTimerOwner,
  } = useSettings();

  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(climbSeconds * 1000);
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  const [referenceTime, setReferenceTime] = useState(0);
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
    const currentTime = Date.now();
    const timePassed = currentTime - referenceTime;
    const newTimeLeft = timeLeft - timePassed;

    setReferenceTime(currentTime);

    if (isCycleFinished) {
      setIsCycleFinished(false);
    }

    if (newTimeLeft > 0) {
      setTimeLeft(newTimeLeft);
      return;
    }

    setIsCycleFinished(true);
    const nextCycleTime = getNextCycleTime();
    setTimeLeft(nextCycleTime + newTimeLeft);
    setIsPreparationTime(
      (prevIsPreparationTime) => isPreparationEnabled && !prevIsPreparationTime,
    );
  }

  useInterval(updateTime, isRunning ? 50 : null);

  function getNextCycleTime() {
    if (!isPreparationEnabled) {
      return climbSeconds * 1000;
    }

    return isPreparationTime ? climbSeconds * 1000 : preparationSeconds * 1000;
  }

  function startTimer(timePassed?: number) {
    const now = Date.now();
    setReferenceTime(now);
    setIsRunning(true);

    if (!isTimerOwner) {
      setTimeLeft(
        timePassed ? climbSeconds * 1000 - timePassed : climbSeconds * 1000,
      );

      return;
    }

    // If resuming from stopped state, adjust startTimestamp to account for pause
    let newStartTimestamp = now;
    if (startTimestamp && stopTimeMilliseconds !== null) {
      // Resume: recalculate startTimestamp so display stays frozen
      newStartTimestamp = now - (climbSeconds * 1000 - stopTimeMilliseconds);
    }
    updateTimerState(newStartTimestamp, dbIsPreparationTime, null);
  }

  function stopTimer() {
    setIsRunning(false);

    if (isTimerOwner) {
      // Save frozen display time when stopping
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
