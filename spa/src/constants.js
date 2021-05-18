import { createContext } from "react";

export const ClientContext = createContext(null);
export const UserContext = createContext(null);

export const userQuery = "user";
export const infoQuery = "info";
export const historyQuery = "history";
export const historyEventQuery = "historyEvent";
export const rocketsQuery = "rockets";
export const rocketQuery = "rocket";
export const roadsterQuery = "roadster";
export const sentToMarsQuery = "sentToMarsQuery";

export const onError = (err, _, rollback) => {
  console.log(err);
  rollback();
};
