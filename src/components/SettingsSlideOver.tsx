import { ChangeEvent } from "react";
import classNames from "classnames";

import SlideOver, { SlideOverSection } from "./ui/SlideOver";
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
    isPreparationEnabled,
    isDarkModeEnabled,
    startTimestamp,
    stopTimeMilliseconds,
    updateClimbSeconds,
    updatePreparationSeconds,
    updateIsPreparationEnabled,
    updateIsDarkModeEnabled,
  } = useSettings();

  const isRunning = startTimestamp !== null && stopTimeMilliseconds === null;

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

  function handleIsPreparationEnabledChange() {
    updateIsPreparationEnabled(!isPreparationEnabled);
  }

  function handleIsDarkModeEnabledChange() {
    updateIsDarkModeEnabled(!isDarkModeEnabled);
  }

  return (
    <SlideOver isOpen={isOpen} onClose={onClose}>
      <SlideOverSection title="Timer Settings">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <label>Preparation time</label>
            <Toggle
              enabled={isPreparationEnabled}
              onClick={handleIsPreparationEnabledChange}
              disabled={isRunning}
            />
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="climbing-seconds">Climbing seconds</label>
            <input
              type="text"
              name="climbing-seconds"
              id="climbing-seconds"
              className={classNames(
                "rounded-md border-0 pl-2 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary",
                isRunning && "opacity-50 cursor-not-allowed",
              )}
              defaultValue={climbSeconds}
              onChange={handleClimbSecondsChange}
              disabled={isRunning}
            />
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="preparation-seconds">Preparation seconds</label>
            <input
              type="text"
              className={classNames(
                "rounded-md border-0 pl-2 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary",
                isRunning && "opacity-50 cursor-not-allowed",
              )}
              id="preparation-seconds"
              defaultValue={preparationSeconds}
              onChange={handlePreparationSecondsChange}
              disabled={isRunning}
            />
          </div>
        </div>
      </SlideOverSection>
      <SlideOverSection title="General Settings">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <label>Dark mode</label>
            <Toggle
              enabled={isDarkModeEnabled}
              onClick={handleIsDarkModeEnabledChange}
            />
          </div>
        </div>
      </SlideOverSection>
    </SlideOver>
  );
};

export default SettingsSlideOver;
