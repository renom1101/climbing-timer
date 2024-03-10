import Main from "./components/Main";
import SettingsContext from "./contexts/settings";
import useSettingsState from "./hooks/useSettingsState";

function App() {
  const settings = useSettingsState();

  return (
    <SettingsContext.Provider value={settings}>
      <Main />
    </SettingsContext.Provider>
  );
}

export default App;
