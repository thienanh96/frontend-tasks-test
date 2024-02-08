import React from "react";
import "./App.css";
import FirstTask from "./tasks/FirstTask";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Task 1:</p>
        <FirstTask />
      </header>
    </div>
  );
}

export default App;
