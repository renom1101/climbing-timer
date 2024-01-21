import { useState } from "react";
import classNames from "classnames";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

import SettingsSlideOver from "./SettingsSlideOver";
import Button from "./ui/Button";

type Props = {
  isControlsVisible: boolean;
  isRunning: boolean;
  climbSeconds: number;
  preparationSeconds: number;
  soundEveryMinute: boolean;
  isPreparationEnabled: boolean;
  onStopStartClick: () => void;
  onResetClick: () => void;
  onSoundEveryMinuteChange: () => void;
  onIsPreparationEnabledChange: () => void;
  updateCurrentTime: (
    newClimbSeconds?: number,
    newPreparationSeconds?: number
  ) => void;
};

export default function Controls({
  isControlsVisible,
  isRunning,
  climbSeconds,
  preparationSeconds,
  soundEveryMinute,
  isPreparationEnabled,
  onStopStartClick,
  onResetClick,
  onSoundEveryMinuteChange,
  onIsPreparationEnabledChange,
  updateCurrentTime,
}: Props) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  function handleSettingsClose() {
    setIsSettingsOpen(false);
  }

  function handleSettingsOpen() {
    setIsSettingsOpen(true);
  }

  const controlsContainerClasses = classNames(
    "transition-opacity",
    "duration-500",
    { "opacity-0": !isControlsVisible, "opacity-100": isControlsVisible }
  );

  return (
    <>
      <div className={controlsContainerClasses}>
        <div className="flex justify-center items-center space-x-2 mb-2">
          <Button className="mr-2" onClick={onStopStartClick}>
            {isRunning ? "Stop" : "Start"}
          </Button>
          <Button onClick={onResetClick} styling={Button.Styling.Secondary}>
            Reset
          </Button>
          <Button
            onClick={handleSettingsOpen}
            styling={Button.Styling.Secondary}
          >
            <Cog6ToothIcon className="h-5 w-5 text-inherit" />
          </Button>
        </div>
      </div>
      <SettingsSlideOver
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        climbSeconds={climbSeconds}
        preparationSeconds={preparationSeconds}
        soundEveryMinute={soundEveryMinute}
        isPreparationEnabled={isPreparationEnabled}
        onSoundEveryMinuteChange={onSoundEveryMinuteChange}
        onIsPreparationEnabledChange={onIsPreparationEnabledChange}
        updateCurrentTime={updateCurrentTime}
      />
    </>
  );
}
