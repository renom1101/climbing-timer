import { useEffect } from "react";

import { playDing, playDong } from "../utils/audio";
import useSettings from "./useSettings";

export default function useSounds(
  isEnabled: boolean,
  timeLeft: number,
  isPreparationTime: boolean,
  isCycleFinished: boolean
) {
  const { climbSeconds, isPlayEveryMinute } = useSettings();

  const totalSeconds = Math.ceil(timeLeft / 1000);

  useEffect(() => {
    if (!isEnabled) return;
    if (!isCycleFinished) return;

    playDong();
  }, [isCycleFinished]);

  useEffect(() => {
    if (!isEnabled) return;

    const lastSeconds = isPreparationTime ? 3 : 5;

    if (totalSeconds > lastSeconds) return;

    playDing();
  }, [totalSeconds]);

  useEffect(() => {
    if (!isEnabled) return;

    if (isPreparationTime || totalSeconds === climbSeconds) return;

    if (totalSeconds === 60) {
      playDing();
    }

    if (!isPlayEveryMinute) return;

    if (totalSeconds % 60 === 0) {
      playDing();
    }
  }, [totalSeconds, isPlayEveryMinute]);
}
