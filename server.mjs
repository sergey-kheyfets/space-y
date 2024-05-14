import * as path from "path";
import fs from "fs";
import express from "express";
import https from "https";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const rootDir = process.cwd();
const port = 3000;//f
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static('spa/build'));

app.use((req, res, next) => {
    const excludePaths = ['/api', '/static', '/login'];
    const isIndexRoute = req.path.includes('index.html');

    if (!excludePaths.some(path => req.path.includes(path)) && !req.cookies.username && isIndexRoute) {
        return res.redirect('/login');
    }
    next();
});

app.get("/", (_, res) => {
    res.send(":)");
});

app.get("/client.mjs", (_, res) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.sendFile(path.join(rootDir, "client.mjs"), {
        maxAge: -1,
        cacheControl: false,
    });
});

app.use(express.static('spa/build'));

app.get('/api/rockets', async (req, res) => {
    try {
        const response = await fetch('https://api.spacexdata.com/v4/rockets');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

app.post('/api/login', (req, res) => {
    const user = req.body.username;
    res.cookie("username", user, {httpOnly: true, secure: true, sameSite: "strict"});
    res.json({username: user || null});
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('username');
    res.sendStatus(200);
});

app.post('/api/sendToMars', (req, res) => {
    res.sendStatus(123);
});

app.get('/api/user', (req, res) => {
    const user = req.cookies["username"];
    res.json({username: user || null});
});

app.get("/", (_, res) => {
    res.send(":)");
});

app.get("/*", (req, res) => {
    res.sendFile(path.resolve("spa/build/index.html"));
});

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
            `App listening on port ${port}`
        );
    });

