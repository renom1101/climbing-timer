import classNames from "classnames";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

import Button from "./ui/Button";

type Props = {
  isControlsVisible: boolean;
  isRunning: boolean;
  onStartClick: () => void;
  onStopClick: () => void;
  onResetClick: () => void;
  onSettingsOpen: () => void;
};

export default function Controls({
  isControlsVisible,
  isRunning,
  onStartClick,
  onStopClick,
  onResetClick,
  onSettingsOpen,
}: Props) {
  const controlsContainerClasses = classNames(
    "transition-opacity",
    "duration-500",
    { "opacity-0": !isControlsVisible, "opacity-100": isControlsVisible }
  );

  const handleStartStopClick = () => {
    if (isRunning) {
      onStopClick();
    } else {
      onStartClick();
    }
  };

  return (
    <>
      <div className={controlsContainerClasses}>
        <div className="flex justify-center items-center space-x-2 mb-2">
          <Button className="mr-2" onClick={handleStartStopClick}>
            {isRunning ? "Stop" : "Start"}
          </Button>
          <Button onClick={onResetClick} styling={Button.Styling.Secondary}>
            Reset
          </Button>
          <Button onClick={onSettingsOpen} styling={Button.Styling.Secondary}>
            <Cog6ToothIcon className="h-5 w-5 text-inherit" />
          </Button>
        </div>
      </div>
    </>
  );
}
