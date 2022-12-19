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

app.use(express.static('spa/build'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())

function validateCookie(req, res, next) {
  if (!req.cookies.username) {
    res.redirect('/login');
  }
  next();
}

app.get("/client.mjs", (_, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.sendFile(path.join(rootDir, "client.mjs"), {
    maxAge: -1,
    cacheControl: false,
  });
});

// app.get("/", (_, res) => {
//   res.render(createPathe('/login'));
// });

app.post('/api/login', (req, res) => {
  res.cookie('username', req.body.username, {
    httpOnly: true, secure: true, sameSite: 'strict', path: '/'
  }).json({username: req.body.username});
})

app.get('/api/getUser', (req, res) => {
  let username = req.cookies.username;
  res.json({username: username});
})

app.get('/api/logoutUser', (req, res) => {
  res.clearCookie("username");
  res.end()
})

app.get('/login', (_, res) => {
  res.sendFile(path.join(rootDir, 'spa/build/index.html'));
})

let items = [
  {
    id: '1',
    name: 'Имя объекта',
    phone: '12345',
    weight: 15,
    color: '#ff0000',
    import: true
  },
  {
    id: '2',
    name: 'Имя объекта',
    phone: '12345',
    weight: 15,
    color: '#ff0000',
    import: true
  }
]

app.post('/api/sendToMars', (req, res) => {
  items.push(JSON.parse(req.body));
  res.json({items: items});
})

app.get('/api/getSentToMars', (req, res) => {
  res.json({items: items});
})

app.use('/*', validateCookie);

// app.get('/api/getInfo', (req, res) => {
//   res.redirect('/login');
//   res.end()
// })

app.get('/*', (_, res) => {
  res.sendFile(path.join(rootDir, 'spa/build/index.html'));
})

// app.listen(port, () => {
//   console.log(`App listening on port ${port}`);
// });

https
  .createServer(
    {
      key: fs.readFileSync("certs/server.key"),
      cert: fs.readFileSync("certs/server.cert"),
    },
    app
  )
  .listen(port, function () {
    console.log(
      `Example app listening on port ${port}! Go to https://localhost:3000/`
    );
  });