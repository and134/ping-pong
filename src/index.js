import React from "react";
import ReactDOM from "react-dom";
import GameTable from "./App";

function Test() {
  return (
    <div>
      <GameTable height={300} width={400} />
    </div>
  );
}

ReactDOM.render(<Test />, document.getElementById("root"));
