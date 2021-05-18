import React, { useContext } from "react";
import { useQuery } from "react-query";
import { ClientContext, infoQuery } from "../../constants";
import cs from "./About.module.css";

const About = () => {
  const client = useContext(ClientContext);
  const { data: info } = useQuery(infoQuery, () => client.getInfo());
  return (
    <section className={cs.content}>
      <h1>About SpaceY</h1>
      <div className={cs.stats}>
        <p>Founder</p>
        <p>{info.founder}</p>
        <p>Founded in</p>
        <p>{info.founded}</p>
        <p>Employees</p>
        <p>{info.employees.toLocaleString("en-US")}</p>
        <p>CEO</p>
        <p>{info.ceo}</p>
        <p>COO</p>
        <p>{info.coo}</p>
        <p>CTO</p>
        <p>{info.cto}</p>
        <p>Valuation</p>
        <p>
          {info.valuation.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
          })}
        </p>
        <p>Headquarters</p>
        <p>{`${info.headquarters.address}, ${info.headquarters.city}, ${info.headquarters.state}`}</p>
        <p>Summary</p>
        <p>{info.summary}</p>
      </div>
    </section>
  );
};

export default About;
