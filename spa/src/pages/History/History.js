import React, { useContext } from "react";
import { useQuery } from "react-query";
import { ClientContext, historyQuery } from "../../constants";
import cs from "./History.module.css";
import { Link } from "react-router-dom";
import { historyEventPath } from "../HistoryEvent";

const History = () => {
  const client = useContext(ClientContext);
  const { data: history } = useQuery(historyQuery, () => client.getHistory());
  return (
    <section className={cs.content}>
      <h1>All historical events</h1>
      <ul className={cs.events}>
        {history.map((event) => (
          <li key={event.id}>
            <Link to={historyEventPath.replace(":id", event.id)}>
              {event.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default History;
