import { useState, useEffect } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

import dingAudioUrl from "../assets/ding.wav";
import finishAudioUrl from "../assets/finish.wav";
import "./Timer.css";
import SettingsSlideOver from "./SettingsSlideOver";

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
  const { climbSeconds = 270, preparationSeconds = 15 } = props;

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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1 className="time-container font-semibold">
          {renderMinutes()}:{renderSeconds()}
        </h1>
      </div>
      <div
        style={{
          opacity: isSettingsVisible ? 1 : 0,
          transition: "all 1s",
        }}
      >
        <div
          className="space-x-2 mb-2"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleStopStart}
            className="bg-lsf-green text-white py-2 px-4 rounded-lg border border-solid border-lsf-green"
          >
            {isRunning ? "Stop" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="bg-lsf-green text-white py-2 px-4 rounded-lg border border-solid border-lsf-green"
          >
            Reset
          </button>
          <button
            onClick={handleSettingsOpen}
            className="py-2 px-4 rounded-lg border border-solid border-lsf-green"
          >
            <Cog6ToothIcon className="h-6 w-6 text-lsf-green" />
          </button>
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
      />
    </div>
  );
};

export default Timer;
