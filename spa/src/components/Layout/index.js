import React, { useContext } from "react";
import cs from "./Layout.module.css";
import Link from "../Link";
import { loginPath } from "../../pages/Login";
import { aboutPath } from "../../pages/About";
import { historyPath } from "../../pages/History";
import { rocketsPath } from "../../pages/Rockets";
import { roadsterPath } from "../../pages/Roadster";
import { sendToMarsPath } from "../../pages/SendToMars";
import { UserContext } from "../../constants";

const Layout = ({ children }) => {
  const user = useContext(UserContext);
  return (
    <>
      <header className={cs.header}>
        <Link to={loginPath}>Login</Link>
        {user ? (
          <>
            <Link to={aboutPath}>About</Link>
            <Link to={historyPath}>History</Link>
            <Link to={rocketsPath}>Rockets</Link>
            <Link to={roadsterPath}>Roadster</Link>
            <Link to={sendToMarsPath}>Send to Mars</Link>
          </>
        ) : null}
      </header>
      <main className={cs.main}>{children}</main>
      <footer className={cs.footer}>SpaceY</footer>
    </>
  );
};

export default Layout;
