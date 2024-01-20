import { ChangeEvent } from "react";

import SlideOver from "./ui/SlideOver";
import Toggle from "./ui/Toggle";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  climbSeconds: number;
  preparationSeconds: number;
  soundEveryMinute: boolean;
  isPreparationEnabled: boolean;
  onSoundEveryMinuteChange: () => void;
  onIsPreparationEnabledChange: () => void;
  updateCurrentTime: (
    newClimbSeconds?: number,
    newPreparationSeconds?: number
  ) => void;
};

const SettingsSlideOver = ({
  isOpen,
  onClose,
  climbSeconds,
  preparationSeconds,
  soundEveryMinute,
  isPreparationEnabled,
  onSoundEveryMinuteChange,
  onIsPreparationEnabledChange,
  updateCurrentTime,
}: Props) => {
  function handleClimbSecondsChange(e: ChangeEvent<HTMLInputElement>) {
    const newSeconds = parseInt(e.target.value, 10);

    if (newSeconds) {
      localStorage.setItem("climbSeconds", newSeconds.toString());
      updateCurrentTime(newSeconds);
    }
  }

  function handlePreparationSecondsChange(e: ChangeEvent<HTMLInputElement>) {
    const newSeconds = parseInt(e.target.value, 10);

    if (newSeconds) {
      localStorage.setItem("preparationSeconds", newSeconds.toString());
      updateCurrentTime(undefined, newSeconds);
    }
  }

  return (
    <SlideOver title="Settings" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <label>Sound every minute</label>
          <Toggle
            enabled={soundEveryMinute}
            onClick={onSoundEveryMinuteChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <label>Preparation time</label>
          <Toggle
            enabled={isPreparationEnabled}
            onClick={onIsPreparationEnabledChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="climbing-seconds">Climbing seconds</label>
          <input
            type="text"
            className="form-control"
            id="climbing-seconds"
            defaultValue={climbSeconds}
            onChange={handleClimbSecondsChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="preparation-seconds">Preparation seconds</label>
          <input
            type="text"
            className="form-control"
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
