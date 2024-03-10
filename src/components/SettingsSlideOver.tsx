import { ChangeEvent } from "react";

import SlideOver from "./ui/SlideOver";
import Toggle from "./ui/Toggle";
import useSettings from "../hooks/useSettings";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SettingsSlideOver = ({ isOpen, onClose }: Props) => {
  const {
    climbSeconds,
    preparationSeconds,
    isPlayEveryMinute,
    isPreparationEnabled,
    updateClimbSeconds,
    updatePreparationSeconds,
    updateIsPlayEveryMinute,
    updateIsPreparationEnabled,
  } = useSettings();

  function handleClimbSecondsChange(e: ChangeEvent<HTMLInputElement>) {
    const newSeconds = parseInt(e.target.value, 10);

    if (newSeconds) {
      updateClimbSeconds(newSeconds);
    }
  }

  function handlePreparationSecondsChange(e: ChangeEvent<HTMLInputElement>) {
    const newSeconds = parseInt(e.target.value, 10);

    if (newSeconds) {
      updatePreparationSeconds(newSeconds);
    }
  }

  function handleIsPlayEveryMinuteChange() {
    updateIsPlayEveryMinute(!isPlayEveryMinute);
  }

  function handleIsPreparationEnabledChange() {
    updateIsPreparationEnabled(!isPreparationEnabled);
  }

  return (
    <SlideOver title="Settings" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <label>Sound every minute</label>
          <Toggle
            enabled={isPlayEveryMinute}
            onClick={handleIsPlayEveryMinuteChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <label>Preparation time</label>
          <Toggle
            enabled={isPreparationEnabled}
            onClick={handleIsPreparationEnabledChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="climbing-seconds">Climbing seconds</label>
          <input
            type="text"
            name="climbing-seconds"
            id="climbing-seconds"
            className="rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            defaultValue={climbSeconds}
            onChange={handleClimbSecondsChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="preparation-seconds">Preparation seconds</label>
          <input
            type="text"
            className="rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            id="preparation-seconds"
            defaultValue={preparationSeconds}
            onChange={handlePreparationSecondsChange}
          />
        </div>
      </div>
    </SlideOver>
  );
};

export default SettingsSlideOver;
