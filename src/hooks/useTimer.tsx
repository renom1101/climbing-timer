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
    updateTimestamps,
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

    updateTimestamps(now, undefined);
  }

  function stopTimer(timePassed?: number) {
    const now = Date.now();
    setIsRunning(false);

    if (!isTimerOwner) {
      setTimeLeft(
        timePassed ? climbSeconds * 1000 - timePassed : climbSeconds * 1000,
      );

      return;
    }

    updateTimestamps(startTimestamp ?? undefined, now);
  }

  function resetTimer() {
    setTimeLeft(climbSeconds * 1000);
    setIsPreparationTime(false);
    setIsRunning(false);

    if (!isTimerOwner) return;

    updateTimestamps(undefined, undefined);
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
