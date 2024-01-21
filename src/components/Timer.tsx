import { useState, useEffect } from "react";

import { playDing, playDong } from "../utils/audio";
import Controls from "./Controls";

let timer: number | undefined = undefined;
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
  const [totalMiliseconds, setTotalMiliseconds] = useState(climbSeconds * 1000);
  const [isPlayEveryMinute, setIsPlayEveryMinute] = useState(false);
  const [isPreparationEnabled, setIsPreparationEnabled] = useState(false);
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [referenceTime, setReferenceTime] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);

  const seconds =
    totalMiliseconds >= 0 ? Math.ceil((totalMiliseconds / 1000) % 60) : 0;
  const minutes =
    totalMiliseconds >= 0 ? Math.floor(totalMiliseconds / (60 * 1000)) : 0;

  function updateClimbTime() {
    const currentTime = Date.now();
    const timePassed = currentTime - referenceTime;
    setReferenceTime(currentTime);

    setTotalMiliseconds((prevMiliseconds) =>
      prevMiliseconds > 0 ? prevMiliseconds - timePassed : climbSeconds * 1000
    );
  }

  function updatePreparationTime() {
    const currentTime = Date.now();
    const timePassed = currentTime - referenceTime;
    setReferenceTime(currentTime);

    setTotalMiliseconds((prevMiliseconds) =>
      prevMiliseconds > 0
        ? prevMiliseconds - timePassed
        : preparationSeconds * 1000
    );
  }

  useEffect(() => {
    if (isRunning) {
      timer = isPreparationTime
        ? setInterval(updatePreparationTime, 50)
        : setInterval(updateClimbTime, 50);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isRunning, isPreparationTime, referenceTime]);

  useEffect(() => {
    if (totalMiliseconds > 0) {
      return;
    }

    setIsPreparationTime(
      (prevIsPreparationTime) => isPreparationEnabled && !prevIsPreparationTime
    );
  }, [totalMiliseconds, isPreparationEnabled]);

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
      clearInterval(timer);
      setIsRunning(false);

      return;
    }

    setReferenceTime(Date.now());
    setIsRunning(true);
  }

  function handleReset() {
    clearInterval(timer);
    setTotalMiliseconds(climbSeconds * 1000);
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
        setTotalMiliseconds(newClimbSeconds * 1000);
      }
    }

    if (newPreparationSeconds) {
      setPreparationSeconds(newPreparationSeconds);

      if (isPreparationTime && !isRunning) {
        setTotalMiliseconds(newPreparationSeconds * 1000);
      }
    }
  }

  function renderMinutes() {
    if (seconds === 60) return minutes + 1;

    return minutes;
  }

  function renderSeconds() {
    if (seconds === 60) return "00";

    return seconds < 10 ? `0${seconds}` : seconds;
  }

  return (
    <div onMouseMove={handleUserActivity}>
      <div className="flex justify-center">
        <h1 className="font-montserrat-mono font-semibold text-[25vw]">
          {renderMinutes()}:{renderSeconds()}
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
