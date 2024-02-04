import { useEffect } from "react";

import { playDing, playDong } from "../utils/audio";

export default function useSounds(
  isEnabled: boolean,
  timeLeft: number,
  isPreparationTime: boolean,
  isPlayEveryMinute: boolean,
  climbSeconds: number
) {
  const totalSeconds = timeLeft >= 0 ? Math.ceil(timeLeft / 1000) : 0;

  useEffect(() => {
    if (!isEnabled) return;

    const lastSeconds = isPreparationTime ? 3 : 5;

    if (totalSeconds <= lastSeconds && totalSeconds > 0) {
      playDing();
    }

    if (totalSeconds === 0) {
      playDong();
    }
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
