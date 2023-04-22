import { useState, useEffect } from "react";

import "./Timer.css";

const dingAudio = new Audio(
  "https://assets.zyrosite.com/AVLB3j2NJ9iaw19Y/ding-YNq9oZG5O9towBZ5.wav"
);
const finishAudio = new Audio(
  "https://assets.zyrosite.com/AVLB3j2NJ9iaw19Y/finish-d95WPyLaLxuO8n4n.wav"
);

let timer = null;

const Timer = (props) => {
  const { climbSeconds = 240, preparationSeconds = 15 } = props;
  const [totalSeconds, setTotalSeconds] = useState(climbSeconds);
  const [isPlayEveryMinute, setIsPlayEveryMinute] = useState(false);
  const [isPreparationEnabled, setIsPreparationEnabled] = useState(false);
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  function updateClimbTime() {
    setTotalSeconds((prevSeconds) =>
      prevSeconds > 0 ? prevSeconds - 1 : climbSeconds
    );
  }

  function updatePreparationTime() {
    setTotalSeconds((prevSeconds) =>
      prevSeconds > 0 ? prevSeconds - 1 : preparationSeconds
    );
  }

  useEffect(() => {
    if (isRunning) {
      timer = isPreparationTime
        ? setInterval(() => updatePreparationTime(), 1000)
        : setInterval(() => updateClimbTime(), 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isRunning, isPreparationTime]);

  useEffect(() => {
    if (totalSeconds > 0) {
      return;
    }

    setIsPreparationTime(
      (prevIsPreparationTime) => isPreparationEnabled && !prevIsPreparationTime
    );
  }, [totalSeconds, isPreparationEnabled]);

  useEffect(() => {
    if (isPreparationTime) {
      if (minutes === 0 && seconds < 4 && seconds > 0) {
        dingAudio.pause();
        dingAudio.currentTime = 0;
        dingAudio.play();
      }

      if (minutes === 0 && seconds === 0) {
        finishAudio.play();
      }

      return;
    }

    if (
      ((minutes === 1 ||
        (isPlayEveryMinute && minutes !== 0 && seconds !== climbSeconds)) &&
        seconds === 0) ||
      (minutes === 0 && seconds < 11 && seconds > 0)
    ) {
      dingAudio.pause();
      dingAudio.currentTime = 0;
      dingAudio.play();
    }

    if (minutes === 0 && seconds === 0) {
      finishAudio.play();
    }
  }, [climbSeconds, isPlayEveryMinute, minutes, seconds]);

  function handleStopStart() {
    if (isRunning) {
      clearInterval(timer);
      setIsRunning(false);

      return;
    }

    setIsRunning(true);
  }

  function handleReset() {
    clearInterval(timer);
    setTotalSeconds(climbSeconds);
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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1 style={{ fontSize: "20em" }}>
          {" "}
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
