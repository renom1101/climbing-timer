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
  isPreparationTime: boolean;
  stopTimeMilliseconds: number | null;
  updateClimbSeconds: (climbSeconds: number) => void;
  updatePreparationSeconds: (preparationSeconds: number) => void;
  updateIsPlayEveryMinute: (playEveryMinute: boolean) => void;
  updateIsPreparationEnabled: (preparationEnabled: boolean) => void;
  updateIsDarkModeEnabled: (isDarkModeEnabled: boolean) => void;
  updateTimerState: (
    startTimestamp?: number | null,
    isPreparationTime?: boolean,
    stopTimeMilliseconds?: number | null,
  ) => void;
};

const useSettingsState = (): Settings => {
  const { userId } = useSession();
  const [isTimerOwner, setIsTimerOwner] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  const [stopTimeMilliseconds, setStopTimeMilliseconds] = useState<
    number | null
  >(null);

  const [climbSeconds, setClimbSeconds] = useState(
    parseInt(localStorage.getItem("climbSeconds") || "", 10) || 270,
  );
  const [preparationSeconds, setPreparationSeconds] = useState(
    parseInt(localStorage.getItem("preparationSeconds") || "", 10) || 15,
  );
  const [isPlayEveryMinute, setPlayEveryMinute] = useState(
    localStorage.getItem("playEveryMinute") === "true",
  );
  const [isPreparationEnabled, setPreparationEnabled] = useState(
    localStorage.getItem("preparationEnabled") === "true",
  );
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(
    localStorage.getItem("isDarkModeEnabled") === "true",
  );

  function updateClimbSeconds(climbSeconds: number) {
    setClimbSeconds(climbSeconds);
    localStorage.setItem("climbSeconds", climbSeconds.toString());

    const timerId = window.location.pathname.substring(1);
    updateTimer({
      id: timerId,
      climbing_seconds: climbSeconds,
    });
  }

  function updatePreparationSeconds(preparationSeconds: number) {
    setPreparationSeconds(preparationSeconds);
    localStorage.setItem("preparationSeconds", preparationSeconds.toString());

    const timerId = window.location.pathname.substring(1);
    updateTimer({
      id: timerId,
      preparation_seconds: preparationSeconds,
    });
  }

  function updateIsPlayEveryMinute(playEveryMinute: boolean) {
    setPlayEveryMinute(playEveryMinute);
    localStorage.setItem("playEveryMinute", playEveryMinute.toString());
  }

  function updateIsPreparationEnabled(preparationEnabled: boolean) {
    setPreparationEnabled(preparationEnabled);
    localStorage.setItem("preparationEnabled", preparationEnabled.toString());

    const timerId = window.location.pathname.substring(1);
    updateTimer({
      id: timerId,
      preparation_enabled: preparationEnabled,
    });
  }

  function updateIsDarkModeEnabled(isDarkModeEnabled: boolean) {
    setIsDarkModeEnabled(isDarkModeEnabled);
    localStorage.setItem("isDarkModeEnabled", isDarkModeEnabled.toString());
  }

  async function updateTimerState(
    startTimestamp?: number | null,
    isPreparationTime?: boolean,
    stopTimeMilliseconds?: number | null,
  ) {
    setStartTimestamp(startTimestamp ?? null);
    if (isPreparationTime !== undefined) {
      setIsPreparationTime(isPreparationTime);
    }
    setStopTimeMilliseconds(stopTimeMilliseconds ?? null);

    const timerId = window.location.pathname.substring(1);

    await updateTimer({
      id: timerId,
      start_timestamp: startTimestamp ?? null,
      is_preparation_time: isPreparationTime,
      stop_time_milliseconds: stopTimeMilliseconds ?? null,
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
    setIsPreparationTime(timer.is_preparation_time);
    setStopTimeMilliseconds(timer.stop_time_milliseconds);
    // Load settings from DB without triggering update
    setClimbSeconds(timer.climbing_seconds);
    setPreparationSeconds(timer.preparation_seconds);
    setPreparationEnabled(timer.preparation_enabled);
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
    isPreparationTime,
    stopTimeMilliseconds,
    updateClimbSeconds,
    updatePreparationSeconds,
    updateIsPlayEveryMinute,
    updateIsPreparationEnabled,
    updateIsDarkModeEnabled,
    updateTimerState,
  };
};

export default useSettingsState;
