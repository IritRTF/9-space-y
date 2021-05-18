import React, { useContext } from "react";
import { useQuery } from "react-query";
import { useParams, Link } from "react-router-dom";
import { ClientContext, historyEventQuery } from "../../constants";
import { historyPath } from "../History";
import cs from "./HistoryEvent.module.css";

const HistoryEvent = () => {
  const { id } = useParams();
  const client = useContext(ClientContext);
  const { data: event } = useQuery([historyEventQuery, id], () =>
    client.getHistoryEvent(id)
  );
  return (
    <section className={cs.content}>
      <footer className={cs.back}>
        <Link to={historyPath}>back</Link>
      </footer>
      <h1>
        {new Date(event.event_date_utc).toLocaleDateString("en-US")}{" "}
        {event.title}
      </h1>
      <p>{event.details}</p>
      <div className={cs.links}>
        {[...Object.entries(event.links)].map(([name, href]) => (
          <a target="_blank" rel="noopener noreferrer" key={href} href={href}>
            {name}
          </a>
        ))}
      </div>
    </section>
  );
};

export default HistoryEvent;
