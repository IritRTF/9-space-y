import { NavLink } from "react-router-dom";
import React from "react";
import cs from "./Link.module.css";

const Link = ({ to, ...rest }) => (
  <NavLink
    to={to}
    className={cs.link}
    activeStyle={{
      color: "var(--accent)",
    }}
    {...rest}
  />
);

export default Link;
