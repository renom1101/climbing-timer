import { ChangeEvent, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";

import SlideOver, { SlideOverSection } from "./ui/SlideOver";
import Toggle from "./ui/Toggle";
import useSettings from "../hooks/useSettings";
import Alert from "./ui/Alert";

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
  const timerLink =
    typeof window === "undefined"
      ? ""
      : window.location.href.replace(/^https?:\/\//, "");
  const timerLinkRef = useRef<HTMLInputElement | null>(null);
  const timerLinkResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [isTimerLinkCopied, setIsTimerLinkCopied] = useState(false);

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

  useEffect(() => {
    return () => {
      if (timerLinkResetTimeout.current) {
        clearTimeout(timerLinkResetTimeout.current);
      }
    };
  }, []);

  async function handleCopyTimerLink() {
    const timerLink = timerLinkRef.current?.value;

    if (!timerLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(timerLink);
      setIsTimerLinkCopied(true);

      if (timerLinkResetTimeout.current) {
        clearTimeout(timerLinkResetTimeout.current);
      }

      timerLinkResetTimeout.current = setTimeout(() => {
        setIsTimerLinkCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy timer link", error);
    }
  }

  return (
    <SlideOver isOpen={isOpen} onClose={onClose}>
      <SlideOverSection title="Timer Settings">
        <div className="space-y-2 text-sm">
          {isRunning && (
            <Alert
              type="warning"
              title="Stop the timer to change timer settings"
            />
          )}
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
      <SlideOverSection title="Share this timer">
        <div className="space-y-2 text-sm">
          <div className="mt-2 grid grid-cols-1">
            <input
              id="timer-link"
              name="timer-link"
              type="text"
              ref={timerLinkRef}
              value={timerLink}
              readOnly
              className={classNames(
                "col-start-1 row-start-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-xs text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary cursor-default relative z-0",
              )}
            />
            <button
              type="button"
              onClick={handleCopyTimerLink}
              aria-label={
                isTimerLinkCopied ? "Timer link copied" : "Copy timer link"
              }
              className="col-start-1 row-start-1 mr-3 inline-flex size-5 items-center justify-center self-center justify-self-end rounded-sm text-gray-900 hover:text-gray-700 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary relative z-10 sm:size-4"
            >
              <span className="relative size-5 sm:size-4">
                <span
                  className={classNames(
                    "absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out",
                    isTimerLinkCopied
                      ? "opacity-0 scale-75"
                      : "opacity-100 scale-100",
                  )}
                >
                  <ClipboardIcon
                    aria-hidden="true"
                    className="size-5 sm:size-4"
                  />
                </span>
                <span
                  className={classNames(
                    "absolute inset-0 flex items-center justify-center text-green-600 transition-all duration-200 ease-out",
                    isTimerLinkCopied
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-75",
                  )}
                >
                  <CheckIcon aria-hidden="true" className="size-5 sm:size-4" />
                </span>
              </span>
            </button>
          </div>
        </div>
      </SlideOverSection>
    </SlideOver>
  );
};

export default SettingsSlideOver;
