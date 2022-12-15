import * as path from "path";
import fs from "fs";
import express from "express";
import https from "https";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { strict } from "assert";

const rootDir = process.cwd();
const port = 3000;
const app = express();


let verifyAuth = function (req, res, next) {
  if (!req.cookies.username && req.path != "/login")
    res.redirect("/login");
  next();
}

app.use(express.static('spa/build'));
app.use(cookieParser());

app.get("/client.mjs", (_, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.sendFile(path.join(rootDir, "client.mjs"), {
    maxAge: -1,
    cacheControl: false,
  });
});

app.get("/api/username", (req, res) => {
  res.send(req.cookies.username);
  res.sendStatus(200);
});

app.get("/api/login", (req, res) => {
  let userName = req.query.username;
  console.log(userName);
  res.cookie("username", userName, {httpOnly: true, secure: true, sameSite: 'Strict'});
  res.sendStatus(200);
});

app.get("/api/logout", (req, res) => {
  console.log(res.cookie.username);
  res.clearCookie('username');
  res.sendStatus(200);
});

app.get("/api/info", async (req, res) => {
  const response = await fetch('https://api.spacexdata.com/v3/info');
  if(response.ok){
    const info = await response.json();
    res.json(info);
  }
  else{
    res.sendStatus(response.status);
  }
});

app.get("/api/history", async (req, res) => {
  const response = await fetch('https://api.spacexdata.com/v3/history');
  if(response.ok){
    const history = await response.json();
    res.json(history);
  }
  else{
    res.sendStatus(response.status);
  }
});

app.get('/api/event', async (req, res) => {
  const id = req.query.id;
  const response = await fetch(`https://api.spacexdata.com/v3/history/${id}`);
  if (response.ok){
      const historyEvent = await response.json();
      res.json(historyEvent);
  }
  else{
    res.sendStatus(response.status);
  }
});

app.get("/api/rockets", async (req, res) => {
  const response = await fetch('https://api.spacexdata.com/v3/rockets');
  if(response.ok){
    const rockets = await response.json();
    res.json(rockets);
  }
  else{
    res.sendStatus(response.status);
  }
});

app.get('/api/rocket', async (req, res) => {
  const id = req.query.id;
  const response = await fetch(`https://api.spacexdata.com/v3/rockets/${id}`);
  if (response.ok){
      const rocket = await response.json();
      res.json(rocket);
  }
  else{
    res.sendStatus(response.status);
  }
});

app.get("/api/roadster", async (req, res) => {
  const response = await fetch('https://api.spacexdata.com/v3/roadster');
  if(response.ok){
    const roadster = await response.json();
    res.json(roadster);
  }
  else{
    res.sendStatus(response.status);
  }
});

// Гадость. В самый низ
app.use(verifyAuth);
app.get("/*", (_, res) => {
  res.sendFile(path.join(rootDir, "spa/build/index.html"));
});

https
  .createServer(
    {
      key: fs.readFileSync("certs/server.key"),
      cert: fs.readFileSync("certs/server.cert"),
    },
    app
  )
  .listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
