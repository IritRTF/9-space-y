import * as path from "path";
import fs from "fs";
import express from "express";
import https from "https";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fetch from "node-fetch";

import User from "./server/user.mjs";
import SendToMars from "./server/sendToMars.mjs";
import { middleware } from "./server/middleware.mjs";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use(express.static('spa/build'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(middleware);

app.get("/client.mjs", (_, res) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.sendFile(path.join(rootDir, "client.mjs"), {
        maxAge: -1,
        cacheControl: false,
    });
});

app.get("/api/user/get", (req, res) => User.get(req, res));
app.get("/api/user/login", (req, res) => User.login(req, res));
app.get("/api/user/logout", (req, res) => User.logout(req, res));

app.post("/api/user/sendToMars/send", (req, res) => SendToMars.send(req, res));
app.post("/api/user/sendToMars/cancel", (req, res) => SendToMars.cancel(req, res));
app.get("/api/user/sendToMars/get", (req, res) => SendToMars.get(req, res));


app.get('/*', function(req, res) {
    res.sendFile(path.join(rootDir, 'spa', 'build', 'index.html'));
});

https.createServer({
            key: fs.readFileSync("certs/server.key"),
            cert: fs.readFileSync("certs/server.cert"),
        },
        app
    )
    .listen(port, function() {
        console.log(`Порт: ${port}`);
    });