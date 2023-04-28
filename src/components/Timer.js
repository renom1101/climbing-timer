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
  const [totalMiliseconds, setTotalMiliseconds] = useState(climbSeconds * 1000);
  const [isPlayEveryMinute, setIsPlayEveryMinute] = useState(false);
  const [isPreparationEnabled, setIsPreparationEnabled] = useState(false);
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [referenceTime, setReferenceTime] = useState();

  const minutes =
    totalMiliseconds >= 0 ? Math.floor(totalMiliseconds / (60 * 1000)) : 0;
  const seconds =
    totalMiliseconds >= 0 ? Math.ceil((totalMiliseconds / 1000) % 60) : 0;

  function updateClimbTime() {
    const currentTime = Date.now();
    const timePassed = currentTime - referenceTime;
    setReferenceTime(currentTime);

    console.log("aaaaaaa", currentTime, referenceTime, timePassed);

    setTotalMiliseconds((prevMiliseconds) =>
      prevMiliseconds > 0 ? prevMiliseconds - timePassed : climbSeconds * 1000
    );
  }

  function updatePreparationTime() {
    const currentTime = Date.now();
    const timePassed = currentTime - referenceTime;
    setReferenceTime(currentTime);

    console.log("aaaaaaa", currentTime, referenceTime, timePassed);

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
      (minutes === 0 && seconds < 6 && seconds > 0)
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
