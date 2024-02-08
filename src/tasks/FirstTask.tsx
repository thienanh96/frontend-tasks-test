import React, { useState } from "react";

function FirstTask() {
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!isNaN(+inputValue) && Number.isInteger(parseFloat(inputValue))) {
      alert(`The number entered is: ${parseInt(inputValue)}`);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="App">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        className={error ? "error" : ""}
        placeholder="Enter a number"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default FirstTask;
