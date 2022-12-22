import * as path from 'path';
import fs from 'fs';
import express from 'express';
import https from 'https';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import * as crypto from 'crypto';

const rootDir = process.cwd();
const port = 3000;
const app = express();

let user = undefined;
const sentToMarsItems = [];

const staticDir = 'spa/build';

app.use(cookieParser('123'));
app.use(express.static(staticDir));
app.use(express.json());

function validateCookie(req, res, next) {
  if (!req.cookies.username) res.redirect('/login');
  next();
}

function appendItemToSentToMarsCollection(item) {
  sentToMarsItems.push({ id: crypto.randomUUID(), ...item });
}

app.get('/client.mjs', (_, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.sendFile(path.join(rootDir, 'client.mjs'), {
    maxAge: -1,
    cacheControl: false,
  });
});

app.post('/api/login', (req, res) => {
  user = req.body.username;
  res
    .cookie('username', user, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    })
    .json({ username: user });
});

app.get('/api/getUser', (req, res) => {
  let username = req.cookies.username;

  if (!username) {
    res.status(401).json({ username: null });
    return;
  }

  res.json({ username: username });
});

app.get('/api/logout', (req, res) => {
  user = undefined;
  res.clearCookie('username').send();
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(rootDir, `${staticDir}/index.html`));
});

app.use('/*', validateCookie);

app.get('/getSentToMars', (req, res) => {
  res.json(sentToMarsItems);
});

app.post('/sendToMars', (req, res) => {
  let item = req.body.item;
  appendItemToSentToMarsCollection(item);
  res.json(sentToMarsItems);
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(rootDir, `${staticDir}/index.html`));
});

// app.listen(port, () => {
//   console.log(`App listening on port ${port}`);
// });

https
  .createServer(
    {
      key: fs.readFileSync('certs/server.key'),
      cert: fs.readFileSync('certs/server.cert'),
    },
    app
  )
  .listen(3000, function () {
    console.log(
      'Example app listening on port 3000! Go to https://localhost:3000/'
    );
  });
