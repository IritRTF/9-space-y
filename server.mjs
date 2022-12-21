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

app.use('/static', express.static(rootDir + "/spa/build/static"))
app.use(cookieParser())


app.get("/client.mjs", (_, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.sendFile(path.join(rootDir, "client.mjs"), {
    maxAge: -1,
    cacheControl: false,
  });
});

https
.createServer(
  {
    key: fs.readFileSync(rootDir + "/certs/server.key"),
    cert: fs.readFileSync(rootDir + "/certs/server.cert"),
  },
  app
)
.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.post("/api/login", (req, res) => {
  res.cookie("username", req.body.username, {httpOnly: true, secure: true, sameSite: 'Strict'})
  .json({username: req.cookies.username});
})

app.get("/api/getUser", (req, res) => {
  res.json({username: req.cookies.username});
})

app.post("/api/logout", (req, res) => {
  res.clearCookie("username");
  res.sendStatus(200);
})

const cookieChecker = function (req, res, next) {
  if (!req.cookies.username && req.path != "/login")
    res.redirect("/login");
  next()
}

app.use(cookieChecker);

app.get('/*', (_, res) => {
  res.sendFile(path.join(rootDir, "spa/build/index.html"));
})