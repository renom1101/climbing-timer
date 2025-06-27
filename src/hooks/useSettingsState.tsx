import { useEffect, useState } from "react";

import {
  getTimerById,
  getTimerByUserId,
  createNewTimer,
  updateTimer,
} from "../data/supabase/timers";
import useSession from "../hooks/useSession";

export type Settings = {
  climbSeconds: number;
  preparationSeconds: number;
  isPlayEveryMinute: boolean;
  isPreparationEnabled: boolean;
  isDarkModeEnabled: boolean;
  isTimerOwner: boolean;
  startTimestamp: number | null;
  updateClimbSeconds: (climbSeconds: number) => void;
  updatePreparationSeconds: (preparationSeconds: number) => void;
  updateIsPlayEveryMinute: (playEveryMinute: boolean) => void;
  updateIsPreparationEnabled: (preparationEnabled: boolean) => void;
  updateIsDarkModeEnabled: (isDarkModeEnabled: boolean) => void;
  updateTimestamp: (timestamp?: number) => void;
};

const useSettingsState = (): Settings => {
  const { userId } = useSession();
  const [isTimerOwner, setIsTimerOwner] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);

  const [climbSeconds, setClimbSeconds] = useState(
    parseInt(localStorage.getItem("climbSeconds") || "", 10) || 270
  );
  const [preparationSeconds, setPreparationSeconds] = useState(
    parseInt(localStorage.getItem("preparationSeconds") || "", 10) || 15
  );
  const [isPlayEveryMinute, setPlayEveryMinute] = useState(
    localStorage.getItem("playEveryMinute") === "true"
  );
  const [isPreparationEnabled, setPreparationEnabled] = useState(
    localStorage.getItem("preparationEnabled") === "true"
  );
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(
    localStorage.getItem("isDarkModeEnabled") === "true"
  );

  function updateClimbSeconds(climbSeconds: number) {
    setClimbSeconds(climbSeconds);
    localStorage.setItem("climbSeconds", climbSeconds.toString());
  }

  function updatePreparationSeconds(preparationSeconds: number) {
    setPreparationSeconds(preparationSeconds);
    localStorage.setItem("preparationSeconds", preparationSeconds.toString());
  }

  function updateIsPlayEveryMinute(playEveryMinute: boolean) {
    setPlayEveryMinute(playEveryMinute);
    localStorage.setItem("playEveryMinute", playEveryMinute.toString());
  }

  function updateIsPreparationEnabled(preparationEnabled: boolean) {
    setPreparationEnabled(preparationEnabled);
    localStorage.setItem("preparationEnabled", preparationEnabled.toString());
  }

  function updateIsDarkModeEnabled(isDarkModeEnabled: boolean) {
    setIsDarkModeEnabled(isDarkModeEnabled);
    localStorage.setItem("isDarkModeEnabled", isDarkModeEnabled.toString());
  }

  async function updateTimestamp(timestamp?: number) {
    const timerId = window.location.pathname.substring(1);

    await updateTimer({
      id: timerId,
      start_timestamp: timestamp ?? null,
    });
  }

  async function getTimers() {
    if (!userId) return;

    const timerId = window.location.pathname.substring(1);

    let timer: TimerModel | undefined = undefined;

    if (timerId) timer = await getTimerById(timerId);

    if (!timer) timer = await getTimerByUserId(userId);

    if (!timer) timer = await createNewTimer();

    if (!timer) return;

    window.history.replaceState(null, "", timer.id);

    setIsTimerOwner(timer.host_id === userId);
    setStartTimestamp(timer.start_timestamp);
    updateClimbSeconds(timer.climbing_seconds);
    updatePreparationSeconds(timer.preparation_seconds);
    updateIsPreparationEnabled(timer.preparation_enabled);
  }

  useEffect(() => {
    getTimers();
  }, [userId]);

  return {
    climbSeconds,
    preparationSeconds,
    isPlayEveryMinute,
    isPreparationEnabled,
    isDarkModeEnabled,
    isTimerOwner,
    startTimestamp,
    updateClimbSeconds,
    updatePreparationSeconds,
    updateIsPlayEveryMinute,
    updateIsPreparationEnabled,
    updateIsDarkModeEnabled,
    updateTimestamp,
  };
};

export default useSettingsState;
