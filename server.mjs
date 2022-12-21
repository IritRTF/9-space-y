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

app.use('/static', express.static(path.join(rootDir, 'spa/build/static')))
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())

https
  .createServer(
    {
      key: fs.readFileSync(path.join(rootDir, "/certs/server.key")),
      cert: fs.readFileSync(path.join(rootDir, "/certs/server.cert")),
    },
    app
  )
  .listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.get("/client.mjs", (_, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.sendFile(path.join(rootDir, "client.mjs"), {
    maxAge: -1,
    cacheControl: false,
  });
});


app.get('/api/getUser', (req, res) => {
  let username = req.cookies.username;
  res.json({username: username});
})

app.post('/api/loginUser', (req, res) => {
  res.cookie('username', req.body.username, {
    httpOnly: true, secure: true, sameSite: 'strict', path: '/'
  }).json({username: req.cookies.username});
})

app.get('/api/logoutUser', (req, res) => {
  res.clearCookie("username");
  res.end()
})

const myLogger = function (req, res, next) {
  if (!req.cookies.username && req.path != "/loginUser")
    res.redirect("/loginUser");
  next()
}
app.use(myLogger)

app.get("/*", (_, res) => {
  res.sendFile(path.join(rootDir, "/spa/build/index.html"));
});