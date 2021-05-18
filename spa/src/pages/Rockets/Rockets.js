import React, { useContext } from "react";
import cs from "./Rockets.module.css";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { ClientContext, rocketsQuery } from "../../constants";
import { rocketPath } from "../Rocket";

const Rockets = () => {
  const client = useContext(ClientContext);
  const { data: rockets } = useQuery(rocketsQuery, () => client.getRockets());
  return (
    <section className={cs.content}>
      <h1>All SpaceY rockets</h1>
      <ul className={cs.rockets}>
        {rockets.map((rocket) => (
          <li key={rocket.rocket_id}>
            <Link to={rocketPath.replace(":id", rocket.rocket_id)}>
              {rocket.rocket_name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Rockets;
