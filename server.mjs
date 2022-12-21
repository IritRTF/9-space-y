import * as path from "path";
import fs from "fs";
import express from "express";
import https from "https";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fetch from "node-fetch";


const rootDir = process.cwd();
const port = 3000;
const app = express();


app.use(cookieParser());
app.use(express.static('spa/build'))
app.use(bodyParser.json())

app.get("/client.mjs", (_, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.sendFile(path.join(rootDir, "client.mjs"), {
    maxAge: -1,
    cacheControl: false,
  });
});

let redirect_log = function (req, res, next) {
  if (!req.cookies.username && req.path != "/login")
    res.redirect("/login");
  next();
}

app.get('/api/user/', (req, res) => {
  res.json({'username': req.cookies.username});
});

app.get("/api/login", (req, res) => {
  let username = req.query.username;
  res.cookie("username", username, {
    HttpOnly: true,
    Secure: true,
    SameSite: 'Strict',
  });
  res.json({username})
});

app.get("/api/logout", (req, res) => {
  let username = req.cookies.username;
  res.clearCookie('username');
  console.log(username)
  res.json({username});
});

app.get('/api/info', async (req, res) => {
  const resp = await fetch('https://api.spacexdata.com/v3/info');
  if (resp.ok) {
      const json = await resp.json();
      console.log(resp.status)
      res.json(json);
  } 
});

app.get('/api/history', async (req, res) => {
  const resp = await fetch('https://api.spacexdata.com/v3/history');
  if (resp.ok) {
      const json = await resp.json();
      res.json(json);
  }
});
app.get('/api/history/event/', async (req, res) => {
  const resp = await fetch(`https://api.spacexdata.com/v3/history/${req.query.id}`);
  if (resp.ok) {
      const json = await resp.json();
      res.json(json);
  }
});
//app.get('/api/rockets', async (req, res) => {
//  const resp = await fetch('https://api.spacexdata.com/v3/rockets');
//  if (resp.ok) {
//      const json = await resp.json();
//      res.json(json);
//  }
//});
app.get('/api/rockets', async (req, res) => {//доделать
  const resp = await fetch(`https://api.spacexdata.com/v3/rockets/${req.query.id}`);
  if (resp.ok) {
      const json = await resp.json();
      res.json(json);
  }
});
app.get('/api/roadster', async (req, res) => {
  const resp = await fetch('https://api.spacexdata.com/v3/roadster');
  if (resp.ok) {
      const json = await resp.json();
      res.json(json);
  }
});
const obj = {}
app.get("/api/user/sendToMars/get", (req, res) => {
  res.json(obj[req.cookies.username]||[]);
});

app.post("/api/user/sendToMars/send", (req, res) => {
  if (!(req.cookies.username in obj)) {
    obj[req.cookies.username] = [];
  }
  obj[req.cookies.username].push(req.body['item']);
  res.json(obj[req.cookies.username]);
});

app.post("/api/user/sendToMars/cancel", (req, res) => {
  if (req.cookies.username in obj) {
      let flag =0;
      console.log(JSON.stringify(obj[req.cookies.username][1])===JSON.stringify(req.body['item']))
      for (var i = 0; i < obj[req.cookies.username].length; i++) {
        console.log(JSON.stringify(obj[req.cookies.username][i])===JSON.stringify(req.body['item']))
        if (JSON.stringify(obj[req.cookies.username][i])===(JSON.stringify(req.body['item']))&&flag===0){
          flag=1;
          obj[req.cookies.username].splice(i, 1);
        }
      }
  }
  res.json(obj[req.cookies.username]);
});

https
  .createServer(
    {
      key: fs.readFileSync("./certs/server.key"),
      cert: fs.readFileSync("./certs/server.cert"),
    },
    app
  )
  .listen(port,()=> {
    console.log(
      "Example app listening on port 3000! Go to https://localhost:3000/"
    );
  });
  app.use(redirect_log);
  app.get("/*", (_, res) => {
  res.sendFile(path.join(rootDir, "spa/build/index.html"))
});

