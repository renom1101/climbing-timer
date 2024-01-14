import { ChangeEvent } from "react";

import SlideOver from "./ui/SlideOver";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  climbSeconds: number;
  preparationSeconds: number;
  soundEveryMinute: boolean;
  isPreparationEnabled: boolean;
  onSoundEveryMinuteChange: () => void;
  onIsPreparationEnabledChange: () => void;
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
}: Props) => {
  function handleClimbSecondsChange(e: ChangeEvent<HTMLInputElement>) {
    const newSeconds = parseInt(e.target.value, 10);

    if (newSeconds) {
      localStorage.setItem("climbSeconds", newSeconds.toString());
    }
  }

  function handlePreparationSecondsChange(e: ChangeEvent<HTMLInputElement>) {
    const newSeconds = parseInt(e.target.value, 10);

    if (newSeconds) {
      localStorage.setItem("preparationSeconds", newSeconds.toString());
    }
  }

  return (
    <SlideOver title="Settings" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="sound-every-minute-slider">Sound every minute</label>
          <label className="switch">
            <input
              id="sound-every-minute-slider"
              type="checkbox"
              defaultChecked={soundEveryMinute}
              onChange={onSoundEveryMinuteChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="flex justify-between">
          <label htmlFor="preparation-time-slider">Preparation time</label>
          <label className="switch">
            <input
              id="preparation-time-slider"
              type="checkbox"
              defaultChecked={isPreparationEnabled}
              onChange={onIsPreparationEnabledChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="flex justify-between">
          <label htmlFor="climbing-seconds">Climbing seconds</label>
          <input
            type="text"
            className="form-control"
            id="climbing-seconds"
            defaultValue={climbSeconds}
            onChange={handleClimbSecondsChange}
          />
        </div>
        <div className="flex justify-between">
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
