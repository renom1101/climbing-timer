import { useEffect, useState } from "react";

import useSettings from "./useSettings";
import useInterval from "./useInterval";
import useSounds from "./useSounds";

const useTimer = () => {
  const {
    climbSeconds,
    preparationSeconds,
    isPreparationEnabled,
    updateTimestamp,
  } = useSettings();

  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(climbSeconds * 1000);
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  const [referenceTime, setReferenceTime] = useState(0);
  const [isCycleFinished, setIsCycleFinished] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState<number>();

  useSounds(isRunning, timeLeft, isPreparationTime, isCycleFinished);

  useEffect(() => {
    if (isRunning) return;

    resetTimer();
  }, [climbSeconds]);

  useEffect(() => {
    console.log("aaaaaa", startTimestamp);
  }, [startTimestamp]);

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
      (prevIsPreparationTime) => isPreparationEnabled && !prevIsPreparationTime
    );
  }

  useInterval(updateTime, isRunning ? 50 : null);

  function getNextCycleTime() {
    if (!isPreparationEnabled) {
      return climbSeconds * 1000;
    }

    return isPreparationTime ? climbSeconds * 1000 : preparationSeconds * 1000;
  }

  function startTimer(startTimestamp?: number, timePassed?: number) {
    const now = Date.now();
    setReferenceTime(now);
    setStartTimestamp(startTimestamp || now);
    setTimeLeft(
      timePassed ? climbSeconds * 1000 - timePassed : climbSeconds * 1000
    );
    setIsRunning(true);

    updateTimestamp(now);
  }

  function stopTimer() {
    setIsRunning(false);

    updateTimestamp(undefined);
  }

  function resetTimer() {
    setTimeLeft(climbSeconds * 1000);
    setIsPreparationTime(false);
    setIsRunning(false);

    updateTimestamp(undefined);
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
