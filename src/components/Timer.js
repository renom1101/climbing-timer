import { useState, useEffect } from "react";

import "./Timer.css";

const dingAudio = new Audio(
  "https://assets.zyrosite.com/AVLB3j2NJ9iaw19Y/ding-YNq9oZG5O9towBZ5.wav"
);
const finishAudio = new Audio(
  "https://assets.zyrosite.com/AVLB3j2NJ9iaw19Y/finish-d95WPyLaLxuO8n4n.wav"
);

function playDing() {
  dingAudio.pause();
  dingAudio.currentTime = 0;
  dingAudio.play();
}

function playFinish() {
  finishAudio.play();
}

let timer = null;
let settingsVisibilityTimer = null;

const Timer = (props) => {
  const { climbSeconds = 240, preparationSeconds = 15 } = props;
  const [totalMiliseconds, setTotalMiliseconds] = useState(climbSeconds * 1000);
  const [isPlayEveryMinute, setIsPlayEveryMinute] = useState(false);
  const [isPreparationEnabled, setIsPreparationEnabled] = useState(false);
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(true);
  const [referenceTime, setReferenceTime] = useState();
  const [startTime, setStartTime] = useState();

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

  useEffect(() => {
    if (!startTime) return;

    const timePassed = Date.now() - startTime;
    const minutes = Math.floor(timePassed / 1000 / 60);
    const seconds = Math.floor((timePassed - minutes * 1000 * 60) / 1000);
    const miliseconds = timePassed - minutes * 1000 * 60 - seconds * 1000;

    console.log(startTime, `${minutes}min ${seconds}s ${miliseconds}ms`);
  }, [minutes, startTime]);

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

    const startTime = Date.now();
    setReferenceTime(startTime);
    console.log(`Started at ${startTime}`);
    setStartTime(startTime);
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
        <h1 style={{ fontSize: "20em" }}>
          {renderMinutes()}:{renderSeconds()}
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: isSettingsVisible ? 1 : 0,
          transition: "all 1s",
        }}
      >
        <button
          type="button"
          onClick={handleStopStart}
          className="btn btn-green btn-sm"
          style={{ margin: "10px" }}
        >
          {isRunning ? "Stop" : "Start"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="btn btn-green btn-sm"
          style={{ margin: "10px" }}
        >
          Reset
        </button>
        <label className="switch" style={{ marginLeft: "20px" }}>
          <input
            type="checkbox"
            defaultChecked={false}
            onChange={handleSoundEveryMinuteChange}
          />
          <span className="slider round"></span>
        </label>
        <span style={{ marginLeft: "10px" }}>Sound every minute</span>
        <label className="switch" style={{ marginLeft: "20px" }}>
          <input
            type="checkbox"
            defaultChecked={false}
            onChange={handlePreparationTimeChange}
          />
          <span className="slider round"></span>
        </label>
        <span style={{ marginLeft: "10px" }}>Preparation time</span>
      </div>
    </div>
  );
};

export default Timer;
