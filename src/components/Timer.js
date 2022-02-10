import { useState, useEffect } from "react";

const Timer = (props) => {
  const { initialMinute = 5, initialSeconds = 0 } = props;
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const dingAudio = new Audio("/ding.wav");
  const finishAudio = new Audio("/finish.wav");

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (!isRunning) return;

      if (
        (minutes === 1 && seconds === 1) ||
        (minutes === 0 && seconds < 12 && seconds > 1)
      ) {
        dingAudio.play();
      }

      if (minutes === 0 && seconds === 1) {
        finishAudio.play();
      }

      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          setMinutes(initialMinute);
          setSeconds(initialSeconds);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  function handleStopStart() {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  }

  function handleReset() {
    setMinutes(initialMinute);
    setSeconds(initialSeconds);
    setIsRunning(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1 style={{ fontSize: "20em" }}>
          {" "}
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </h1>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          onClick={handleStopStart}
          style={{ margin: "10px" }}
        >
          {isRunning ? "Stop" : "Start"}
        </button>
        <button type="button" onClick={handleReset} style={{ margin: "10px" }}>
          Reset
        </button>
      </div>
      <audio src="/ding.wav"></audio>
      <audio src="/finish.wav"></audio>
    </div>
  );
};

export default Timer;
