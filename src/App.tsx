import Main from "./components/Main";
import SettingsContext from "./contexts/settings";
import useSettingsState from "./hooks/useSettingsState";

function App() {
  const settings = useSettingsState();

  if (settings.isLoading) {
    return <div className="bg-background" />;
  }

  return (
    <SettingsContext.Provider value={settings}>
      <Main />
    </SettingsContext.Provider>
  );
}

export default App;
