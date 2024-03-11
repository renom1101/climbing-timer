import { Switch } from "@headlessui/react";
import classNames from "classnames";

type Props = {
  enabled: boolean;
  onClick: () => void;
};

export default function Toggle({ enabled, onClick }: Props) {
  return (
    <Switch
      checked={enabled}
      onChange={onClick}
      className={classNames(
        enabled ? "bg-primary" : "bg-gray-200 dark:bg-gray-800",
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
    >
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? "translate-x-5" : "translate-x-0",
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        )}
      />
    </Switch>
  );
}
