import React, { useContext } from "react";
import cs from "./Rocket.module.css";
import { Link, useParams } from "react-router-dom";
import { rocketsPath } from "../Rockets";
import { ClientContext, rocketQuery } from "../../constants";
import { useQuery } from "react-query";

const allowlist = new Set([
  "height",
  "diameter",
  "mass",
  "engines",
  "first_stage",
  "second_stage",
]);

const Rocket = () => {
  const { id } = useParams();
  const client = useContext(ClientContext);
  const { data: rocket } = useQuery([rocketQuery, id], () =>
    client.getRocket(id)
  );
  return (
    <>
      <section className={cs.content}>
        <footer className={cs.back}>
          <Link to={rocketsPath}>back</Link>
        </footer>
        <h1>
          {rocket.rocket_name} ({rocket.first_flight})
        </h1>
        <p>{rocket.description}</p>
        <details className={cs.stats}>
          <summary>Stats</summary>
          <pre>
            {JSON.stringify(
              Object.fromEntries(
                Object.entries(rocket).filter(([key]) => allowlist.has(key))
              ),
              null,
              2
            )}
          </pre>
        </details>
        <div className={cs.links}>
          {[...Object.entries({ wikipedia: rocket.wikipedia })].map(
            ([name, href]) => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                key={href}
                href={href}
              >
                {name}
              </a>
            )
          )}
        </div>
      </section>
      <div className={cs.wrapper}>
        <div className={cs.images}>
          {rocket.flickr_images.map((src) => (
            <img key={src} src={src} alt={rocket.rocket_name} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Rocket;
