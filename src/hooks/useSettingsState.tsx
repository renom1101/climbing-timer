import { useEffect, useState } from "react";

import {
  getTimerById,
  getTimerByUserId,
  createNewTimer,
  updateTimer,
} from "../data/supabase/timers";
import useSession from "../hooks/useSession";
import { useTimerSubscription } from "../hooks/useTimerSubscription";
import { TimerModel } from "../data/supabase/types";

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
  const [timerId, setTimerId] = useState<string | null>(null);

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
    setTimerId(timer.id);
    // Load settings from DB without triggering update
    setClimbSeconds(timer.climbing_seconds);
    setPreparationSeconds(timer.preparation_seconds);
    setPreparationEnabled(timer.preparation_enabled);
  }

  // Handle realtime subscription updates
  function handleTimerUpdate(updatedTimer: Partial<TimerModel>) {
    // Update timer state from realtime subscription
    if (updatedTimer.start_timestamp !== undefined) {
      setStartTimestamp(updatedTimer.start_timestamp);
    }
    if (updatedTimer.is_preparation_time !== undefined) {
      setIsPreparationTime(updatedTimer.is_preparation_time);
    }
    if (updatedTimer.stop_time_milliseconds !== undefined) {
      setStopTimeMilliseconds(updatedTimer.stop_time_milliseconds);
    }
    // Update settings if they changed
    if (updatedTimer.climbing_seconds !== undefined) {
      setClimbSeconds(updatedTimer.climbing_seconds);
    }
    if (updatedTimer.preparation_seconds !== undefined) {
      setPreparationSeconds(updatedTimer.preparation_seconds);
    }
    if (updatedTimer.preparation_enabled !== undefined) {
      setPreparationEnabled(updatedTimer.preparation_enabled);
    }
  }

  // Subscribe to realtime updates
  useTimerSubscription({
    timerId,
    onUpdate: handleTimerUpdate,
  });

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
