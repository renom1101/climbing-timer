import { useState } from "react";

export type Settings = {
  climbSeconds: number;
  preparationSeconds: number;
  isPlayEveryMinute: boolean;
  isPreparationEnabled: boolean;
  isDarkModeEnabled: boolean;
  updateClimbSeconds: (climbSeconds: number) => void;
  updatePreparationSeconds: (preparationSeconds: number) => void;
  updateIsPlayEveryMinute: (playEveryMinute: boolean) => void;
  updateIsPreparationEnabled: (preparationEnabled: boolean) => void;
  updateIsDarkModeEnabled: (isDarkModeEnabled: boolean) => void;
};

const useSettingsState = (): Settings => {
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

  return {
    climbSeconds,
    preparationSeconds,
    isPlayEveryMinute,
    isPreparationEnabled,
    isDarkModeEnabled,
    updateClimbSeconds,
    updatePreparationSeconds,
    updateIsPlayEveryMinute,
    updateIsPreparationEnabled,
    updateIsDarkModeEnabled,
  };
};

export default useSettingsState;
