import { createContext } from "react";

import { Settings } from "../hooks/useSettingsState";

const SettingsContext = createContext<Settings | undefined>(undefined);

export default SettingsContext;
