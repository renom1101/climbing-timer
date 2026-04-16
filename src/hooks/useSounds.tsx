import { useEffect, useRef } from "react";

import { playDing, playDong } from "../utils/audio";
import useSettings from "./useSettings";

export default function useSounds(
  isEnabled: boolean,
  timeLeft: number,
  isCycleFinished: boolean,
) {
  const { climbSeconds, isPlayEveryMinute } = useSettings();

  const totalSeconds = Math.ceil(timeLeft / 1000);
  const prevSeconds = useRef(totalSeconds);

  useEffect(() => {
    if (!isEnabled) return;
    if (!isCycleFinished) return;

    playDong();
  }, [isCycleFinished]);

  useEffect(() => {
    const prev = prevSeconds.current;
    prevSeconds.current = totalSeconds;

    if (!isEnabled) return;
    if (totalSeconds >= prev) return;

    const lastSeconds = 5;
    if (totalSeconds > lastSeconds) return;

    playDing();
  }, [totalSeconds]);

  useEffect(() => {
    if (!isEnabled || !isPlayEveryMinute) return;
    if (totalSeconds === climbSeconds) return;
    if (totalSeconds > 0 && totalSeconds % 60 === 0) {
      playDing();
    }
  }, [totalSeconds, isPlayEveryMinute]);
}
