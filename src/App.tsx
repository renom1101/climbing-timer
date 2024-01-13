import Timer from "./components/Timer";
import "./App.css";

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Timer
        climbSeconds={
          parseInt(localStorage.getItem("climbSeconds") || "", 10) || 270
        }
        preparationSeconds={
          parseInt(localStorage.getItem("preparationSeconds") || "", 10) || 15
        }
      />
    </div>
  );
}

export default App;
