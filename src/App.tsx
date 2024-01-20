import Timer from "./components/Timer";

function App() {
  return (
    <div className="flex justify-center items-center">
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
