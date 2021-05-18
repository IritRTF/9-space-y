import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import(/* webpackIgnore: true */ "/client.mjs").then(({ Client }) => {
  ReactDOM.render(
    <App client={new Client()} />,
    document.getElementById("root")
  );
});
