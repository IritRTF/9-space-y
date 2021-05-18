import React, { useContext } from "react";
import { useQuery } from "react-query";
import { ClientContext, roadsterQuery } from "../../constants";
import cs from "./Roadster.module.css";

const Roadster = () => {
  const client = useContext(ClientContext);
  const { data: roadster } = useQuery(roadsterQuery, () =>
    client.getRoadster()
  );
  return (
    <section className={cs.content}>
      <h1>
        {roadster.name} (
        {new Date(roadster.launch_date_utc).toLocaleDateString("en-US")})
      </h1>
      <p>{roadster.details}</p>
      <div className={cs.progress}>
        Earth
        <progress
          value={roadster.earth_distance_km}
          max={roadster.earth_distance_km + roadster.mars_distance_km}
        />
        Mars
      </div>
      <div className={cs.links}>
        {[...Object.entries({ wikipedia: roadster.wikipedia })].map(
          ([name, href]) => (
            <a target="_blank" rel="noopener noreferrer" key={href} href={href}>
              {name}
            </a>
          )
        )}
      </div>
    </section>
  );
};

export default Roadster;
