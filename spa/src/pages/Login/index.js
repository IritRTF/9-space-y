import { lazy } from "react";

export const loginPath = "/login";

export const LoginPage = lazy(() => import("./Login"));
