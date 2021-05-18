import { lazy } from "react";
import { rocketsPath } from "../Rockets";

export const rocketPath = `${rocketsPath}/:id`;

export const RocketPage = lazy(() => import("./Rocket"));
