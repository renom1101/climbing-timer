import { useState, useEffect } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

import dingAudioUrl from "../assets/ding.wav";
import finishAudioUrl from "../assets/finish.wav";
import "./Timer.css";
import SettingsSlideOver from "./SettingsSlideOver";
import Button from "./ui/Button";
import classNames from "classnames";

const dingAudio = new Audio(dingAudioUrl);
const finishAudio = new Audio(finishAudioUrl);

function playDing() {
  dingAudio.pause();
  dingAudio.currentTime = 0;
  dingAudio.play();
}

function playFinish() {
  finishAudio.play();
}

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
  const [isSettingsVisible, setIsSettingsVisible] = useState(true);
  const [referenceTime, setReferenceTime] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
      playFinish();
    }

    if (isPreparationTime) {
      return;
    }

    if ((minutes === 0 || isPlayEveryMinute) && seconds === 60) {
      playDing();
    }
  }, [climbSeconds, isPlayEveryMinute, minutes, seconds, isPreparationTime]);

  function handleUserActivity() {
    setIsSettingsVisible(true);
    clearTimeout(settingsVisibilityTimer);

    if (!isRunning) return;

    settingsVisibilityTimer = setTimeout(
      () => setIsSettingsVisible(false),
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

  function handleSettingsClose() {
    setIsSettingsOpen(false);
  }

  function handleSettingsOpen() {
    setIsSettingsOpen(true);
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

  const controlsContainerClasses = classNames(
    "transition-opacity",
    "duration-500",
    { "opacity-0": !isSettingsVisible, "opacity-100": isSettingsVisible }
  );

  return (
    <div onMouseMove={handleUserActivity}>
      <div className="flex justify-center">
        <h1 className="time-container font-semibold">
          {renderMinutes()}:{renderSeconds()}
        </h1>
      </div>
      <div className={controlsContainerClasses}>
        <div className="flex justify-center items-center space-x-2 mb-2">
          <Button className="mr-2" onClick={handleStopStart}>
            {isRunning ? "Stop" : "Start"}
          </Button>
          <Button onClick={handleReset} styling={Button.Styling.Secondary}>
            Reset
          </Button>
          <Button
            onClick={handleSettingsOpen}
            styling={Button.Styling.Secondary}
          >
            <Cog6ToothIcon className="h-5 w-5 text-inherit" />
          </Button>
        </div>
      </div>
      <SettingsSlideOver
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        climbSeconds={climbSeconds}
        preparationSeconds={preparationSeconds}
        soundEveryMinute={isPlayEveryMinute}
        isPreparationEnabled={isPreparationEnabled}
        onSoundEveryMinuteChange={handleSoundEveryMinuteChange}
        onIsPreparationEnabledChange={handlePreparationTimeChange}
        updateCurrentTime={updateCurrentTime}
      />
    </div>
  );
};

export default Timer;
