import * as path from "path";
import fs from "fs";
import express from "express";
import https from "https";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fetch from "node-fetch";

import SendToMars from "./SendToMars.mjs";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use(express.static('spa/build'))
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())

const validate =  function(req , res , next){
  let root = req.url.split('/')[1];
  let pass = ['api','build','login' , 'client.mjs'].includes(root);
  let cookies = req.cookies.username !== undefined;
  (pass || cookies) ? next():  res.redirect('/login');
}

app.use(validate);

https
  .createServer(
    {
      key: fs.readFileSync("certs/server.key"),
      cert: fs.readFileSync("certs/server.cert"),
    },
    app
  ).listen(port, function() {
    console.log(`Порт: ${port}`);
});

app.get("/client.mjs", (req, res) => {
  if (req.cookies.username) res.clearCookie('username');
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.sendFile(path.join(rootDir, "client.mjs"), {
    maxAge: -1,
    cacheControl: false,
  });
});

app.post('/api/user/sendToMars/send',(req,res)=> SendToMars.send(req,res));
app.post('/api/user/sendToMars/cancel',(req,res)=> SendToMars.cancel(req,res));
app.get('/api/user/sendToMars/get',(req,res)=> SendToMars.get(req,res));

app.get('/api/user',(req,res)=>{
  res.json({username: req.cookies.username});
});

app.post('/api/login', (req, res) => {
  res.cookie('username', req.body.username, {
      httpOnly: true, secure: true, sameSite: 'strict', path: '/'
  }).json({username: req.cookies.username});
})

app.get('/api/logout' , (req , res)=>{
  res.clearCookie('username');
  res.redirect('/');
});

app.get("/*", (_, res) => {
  res.sendFile(path.join(rootDir, 'spa', 'build', 'index.html'));
});