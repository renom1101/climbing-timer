import { useContext } from "react";

import SettingsContext from "../contexts/settings";

function useSettings() {
  const settingsContext = useContext(SettingsContext);

  if (!settingsContext) throw new Error("Missing settings provider");

  return settingsContext;
}

export default useSettings;
