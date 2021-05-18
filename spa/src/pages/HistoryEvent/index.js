import { lazy } from "react";
import { historyPath } from "../History";

export const historyEventPath = `${historyPath}/:id`;

export const HistoryEventPage = lazy(() => import("./HistoryEvent"));
