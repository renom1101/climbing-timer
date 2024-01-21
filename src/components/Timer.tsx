import { useState, useEffect } from "react";

import Controls from "./Controls";
import { formatTime } from "../utils/formatTime";
import useInterval from "../hooks/useInterval";
import useSounds from "../hooks/useSounds";

type Props = {
  climbSeconds: number;
  preparationSeconds: number;
  isRunning: boolean;
  isControlsVisible: boolean;
  onStart: () => void;
  onStop: () => void;
  updateClimbTime: (newClimbSeconds: number) => void;
  updatePreparationTime: (newPreparationSeconds: number) => void;
};

const Timer = ({
  climbSeconds,
  preparationSeconds,
  isRunning,
  isControlsVisible,
  onStart,
  onStop,
  updateClimbTime,
  updatePreparationTime,
}: Props) => {
  const [timeLeft, setTimeLeft] = useState(climbSeconds * 1000);
  const [nextCycleTime, setNextCycleTime] = useState(climbSeconds * 1000);

  const [isPlayEveryMinute, setIsPlayEveryMinute] = useState(
    localStorage.getItem("playEveryMinute") === "true"
  );
  const [isPreparationEnabled, setIsPreparationEnabled] = useState(
    localStorage.getItem("preparationEnabled") === "true"
  );
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  const [referenceTime, setReferenceTime] = useState(0);

  useSounds(timeLeft, isPreparationTime, isPlayEveryMinute, climbSeconds);

  function updateTime() {
    const currentTime = Date.now();
    const timePassed = currentTime - referenceTime;

    setReferenceTime(currentTime);
    setTimeLeft(
      (prevTimeLeft) =>
        prevTimeLeft - timePassed + (prevTimeLeft > 0 ? 0 : nextCycleTime)
    );
  }

  useInterval(updateTime, isRunning ? 50 : null);

  useEffect(() => {
    if (timeLeft > 0) {
      return;
    }

    setIsPreparationTime(
      (prevIsPreparationTime) => isPreparationEnabled && !prevIsPreparationTime
    );

    if (!isPreparationEnabled) {
      setNextCycleTime(climbSeconds * 1000);

      return;
    }

    setNextCycleTime((prevNextCycleTimeLeft) =>
      prevNextCycleTimeLeft === climbSeconds * 1000
        ? preparationSeconds * 1000
        : climbSeconds * 1000
    );
  }, [timeLeft, isPreparationEnabled]);

  function handleStopStart() {
    if (isRunning) {
      onStop();

      return;
    }

    setReferenceTime(Date.now());
    onStart();
  }

  function handleReset() {
    setTimeLeft(climbSeconds * 1000);
    onStop();
  }

  function handleSoundEveryMinuteChange() {
    localStorage.setItem("playEveryMinute", (!isPlayEveryMinute).toString());
    setIsPlayEveryMinute((prevIsPlayEveryMinute) => !prevIsPlayEveryMinute);
  }

  function handlePreparationTimeChange() {
    localStorage.setItem(
      "preparationEnabled",
      (!isPreparationEnabled).toString()
    );
    setIsPreparationEnabled(
      (prevIsPreparationTimeEnabled) => !prevIsPreparationTimeEnabled
    );
  }

  function updateCurrentTime(
    newClimbSeconds?: number,
    newPreparationSeconds?: number
  ) {
    if (newClimbSeconds) {
      updateClimbTime(newClimbSeconds);

      if (!isPreparationTime && !isRunning) {
        setTimeLeft(newClimbSeconds * 1000);
      }
    }

    if (newPreparationSeconds) {
      updatePreparationTime(newPreparationSeconds);

      if (isPreparationTime && !isRunning) {
        setTimeLeft(newPreparationSeconds * 1000);
      }
    }
  }

  return (
    <div>
      <div className="flex justify-center">
        <h1 className="font-montserrat-mono font-semibold text-[25vw]">
          {formatTime(timeLeft, nextCycleTime)}
        </h1>
      </div>
      <Controls
        isControlsVisible={isControlsVisible}
        isRunning={isRunning}
        climbSeconds={climbSeconds}
        preparationSeconds={preparationSeconds}
        soundEveryMinute={isPlayEveryMinute}
        isPreparationEnabled={isPreparationEnabled}
        onStopStartClick={handleStopStart}
        onResetClick={handleReset}
        onSoundEveryMinuteChange={handleSoundEveryMinuteChange}
        onIsPreparationEnabledChange={handlePreparationTimeChange}
        updateCurrentTime={updateCurrentTime}
      />
    </div>
  );
};

export default Timer;
