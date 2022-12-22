import * as path from "path";
import fs from "fs";
import express from "express";
import https from "https";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { Console } from "console";

const rootDir = process.cwd();
const port = 3000;
const app = express();

const StaticDir = 'spa/build'

app.use(express.static(StaticDir))
app.use(cookieParser());
app.use(express.json());

app.get("/client.mjs", (_, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.sendFile(path.join(rootDir, "client.mjs"), {
    maxAge: -1,
    cacheControl: false,
  });
});

app.get("/login", (_, res) => {
  res.sendFile(path.join(rootDir, `${StaticDir}/index.html`));
});

app.get("/api/user", (req, res) => {
  const userName = req.cookies.username;
  res.send(userName);
});

app.get("/api/login", (req, res) => {
  const userName = req.query.username;
  res.cookie("username", userName, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.send(userName);
});

app.get("/api/logoutUser", (req, res) => {
  res.clearCookie("username");
  res.sendStatus(200);
});

app.get("/api/getSentToMars", (req, res) => {
  res.send(itemList);
});

app.post("/api/sendToMars", (req, res) => {
  let item = req.body
  itemList.push(new Item(item.name, item.phone, item.weight, item.color, item.important))
});

app.post("/api/cancelSendingToMars", (req, res) => {
  let item = req.body
  console.log(item)
  const index = itemList.findIndex((el) => el.id === item.id);
  console.log(index)
  itemList.splice(index, 1);
  console.log(itemList)
});

app.use('/*', validateCookies)

async function validateCookies (req, res, next) {
  if (!req.cookies.username) res.redirect('/login')
  next()
}

app.get("/*", (_, res) => {
  res.redirect("/login")
});

https
  .createServer(
    {
      key: fs.readFileSync("certs/server.key"),
      cert: fs.readFileSync("certs/server.cert"),
    },
    app
  )
  .listen(3000, function () {
    console.log(
      "Example app listening on port 3000! Go to https://localhost:3000/"
    );
  });

class Item {
  constructor(name, phone, weight, color, important) {
    console.log(counter)
    this.id = counter;
    this.name = name;
    this.phone = phone;
    this.weight = weight;
    this.color = color;
    this.important = important;

    counter++;
  }
}

let counter = 0
let itemList = [new Item('rkfcc', '123', 234, '#ffffff', true)]
