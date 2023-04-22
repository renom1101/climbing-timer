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
  const { initialSeconds = 270 } = props;
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isPlayEveryMinute, setIsPlayEveryMinute] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  function updateTime() {
    setTotalSeconds((prevSeconds) =>
      prevSeconds > 0 ? prevSeconds - 1 : initialSeconds
    );
  }

  useEffect(() => {
    if (isRunning) {
      timer = setInterval(() => updateTime(), 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isRunning]);

  useEffect(() => {
    if (
      ((minutes === 1 ||
        (isPlayEveryMinute && minutes !== 0 && seconds !== initialSeconds)) &&
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
  }, [initialSeconds, isPlayEveryMinute, minutes, seconds]);

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
    setTotalSeconds(initialSeconds);
    setIsRunning(false);
  }

  function handleSoundEveryMinuteChange() {
    setIsPlayEveryMinute((prevIsPlayEveryMinute) => !prevIsPlayEveryMinute);
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
      </div>
    </div>
  );
};

export default Timer;
