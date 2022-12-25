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
app.use(express.static('spa/build'))
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())


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
            "Example app listening on port 3000! Go to https://localhost:3000/"
        );
    });


app.get("/client.mjs", (_, res) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.sendFile(path.join(rootDir, "client.mjs"), {
        maxAge: -1,
        cacheControl: false,
    });
});

app.get("/", (_, res) => {
    res.send(":)");

});


app.get('/api/getUser', (req, res) => {
    let username = req.cookies.username;
    res.json({username: username});
})

app.post('/api/login', (req, res) => {
    res.cookie('username', req.body.username, {
        httpOnly: true, secure: true, sameSite: 'strict', path: '/'
    }).json({username: req.cookies.username});
})

app.get('/api/logout', (req, res) => {
    res.clearCookie("username");
    res.end()
})

const myLogger = function (req, res, next) {
    if (!req.cookies.username) {
        res.redirect('/login');
    }
    next()
}

app.use('/*', myLogger);

app.get("/*", (_, res) => {
    res.sendFile(path.join(rootDir, "/spa/build/index.html"));
});