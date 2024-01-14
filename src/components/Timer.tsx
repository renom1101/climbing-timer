import { useState, useEffect, ChangeEvent } from "react";

import dingAudioUrl from "../assets/ding.wav";
import finishAudioUrl from "../assets/finish.wav";
import "./Timer.css";

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
}

const Timer = (props: Props) => {
  const { climbSeconds = 270, preparationSeconds = 15 } = props;

  const [totalMiliseconds, setTotalMiliseconds] = useState(climbSeconds * 1000);
  const [isPlayEveryMinute, setIsPlayEveryMinute] = useState(false);
  const [isPreparationEnabled, setIsPreparationEnabled] = useState(false);
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(true);
  const [referenceTime, setReferenceTime] = useState(0);

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

  function handleClimbSecondsChange(e: ChangeEvent<HTMLInputElement>) {
    const newSeconds = parseInt(e.target.value, 10);

    if (newSeconds) {
      localStorage.setItem("climbSeconds", newSeconds.toString());
    }
  }

  function handlePreparationSecondsChange(e: ChangeEvent<HTMLInputElement>) {
    const newSeconds = parseInt(e.target.value, 10);

    if (newSeconds) {
      localStorage.setItem("preparationSeconds", newSeconds.toString());
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
            className="button text-white py-2 px-4 rounded-lg"
          >
            {isRunning ? "Stop" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="button text-white py-2 px-4 rounded-lg"
          >
            Reset
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <label className="switch" style={{ marginLeft: "20px" }}>
            <input
              id="sound-every-minute-slider"
              type="checkbox"
              defaultChecked={false}
              onChange={handleSoundEveryMinuteChange}
            />
            <span className="slider round"></span>
          </label>
          <label
            htmlFor="sound-every-minute-slider"
            style={{ marginLeft: "10px" }}
          >
            Sound every minute
          </label>
          <label className="switch" style={{ marginLeft: "20px" }}>
            <input
              id="preparation-time-slider"
              type="checkbox"
              defaultChecked={false}
              onChange={handlePreparationTimeChange}
            />
            <span className="slider round"></span>
          </label>
          <label
            htmlFor="preparation-time-slider"
            style={{ marginLeft: "10px" }}
          >
            Preparation time
          </label>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="form-inline"
        >
          <div className="form-group col-md-2">
            <label htmlFor="climbing-seconds">Climbing seconds: </label>
            <input
              type="text"
              className="form-control"
              id="climbing-seconds"
              defaultValue={climbSeconds}
              onChange={handleClimbSecondsChange}
            />
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="preparation-seconds">Preparation seconds: </label>
            <input
              type="text"
              className="form-control"
              id="preparation-seconds"
              defaultValue={preparationSeconds}
              onChange={handlePreparationSecondsChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
