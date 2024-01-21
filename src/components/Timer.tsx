import { useState, useEffect } from "react";

import { playDing, playDong } from "../utils/audio";
import Controls from "./Controls";
import { formatTime } from "../utils/formatTime";
import useInterval from "../hooks/useInterval";

let settingsVisibilityTimer: number | undefined = undefined;

type Props = {
  climbSeconds: number;
  preparationSeconds: number;
};

const Timer = (props: Props) => {
  const [climbSeconds, setClimbSeconds] = useState(props.climbSeconds);
  const [preparationSeconds, setPreparationSeconds] = useState(
    props.preparationSeconds
  );
  const [timeLeft, setTimeLeft] = useState(climbSeconds * 1000);
  const [nextCycleTime, setNextCycleTime] = useState(climbSeconds * 1000);

  const [isPlayEveryMinute, setIsPlayEveryMinute] = useState(false);
  const [isPreparationEnabled, setIsPreparationEnabled] = useState(false);
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [referenceTime, setReferenceTime] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);

  const seconds = timeLeft >= 0 ? Math.ceil((timeLeft / 1000) % 60) : 0;
  const minutes = timeLeft >= 0 ? Math.floor(timeLeft / (60 * 1000)) : 0;

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

  useEffect(() => {
    if (
      minutes * 60 + seconds === climbSeconds ||
      (minutes + 1) * 60 + seconds === climbSeconds
    )
      return;

    const lastSeconds = isPreparationTime ? 3 : 5;

    if (minutes === 0 && seconds <= lastSeconds && seconds > 0) {
      playDing();
    }

    if (minutes === 0 && seconds === 0) {
      playDong();
    }

    if (isPreparationTime) {
      return;
    }

    if ((minutes === 0 || isPlayEveryMinute) && seconds === 60) {
      playDing();
    }
  }, [climbSeconds, isPlayEveryMinute, minutes, seconds, isPreparationTime]);

  function handleUserActivity() {
    setIsControlsVisible(true);
    clearTimeout(settingsVisibilityTimer);

    if (!isRunning) return;

    settingsVisibilityTimer = setTimeout(
      () => setIsControlsVisible(false),
      5000
    );
  }

  function handleStopStart() {
    if (isRunning) {
      setIsRunning(false);

      return;
    }

    setReferenceTime(Date.now());
    setIsRunning(true);
  }

  function handleReset() {
    setTimeLeft(climbSeconds * 1000);
    setIsRunning(false);
  }

  function handleSoundEveryMinuteChange() {
    setIsPlayEveryMinute((prevIsPlayEveryMinute) => !prevIsPlayEveryMinute);
  }

  function handlePreparationTimeChange() {
    setIsPreparationEnabled(
      (prevIsPreparationTimeEnabled) => !prevIsPreparationTimeEnabled
    );
  }

  function updateCurrentTime(
    newClimbSeconds?: number,
    newPreparationSeconds?: number
  ) {
    if (newClimbSeconds) {
      setClimbSeconds(newClimbSeconds);

      if (!isPreparationTime && !isRunning) {
        setTimeLeft(newClimbSeconds * 1000);
      }
    }

    if (newPreparationSeconds) {
      setPreparationSeconds(newPreparationSeconds);

      if (isPreparationTime && !isRunning) {
        setTimeLeft(newPreparationSeconds * 1000);
      }
    }
  }

  return (
    <div onMouseMove={handleUserActivity}>
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
