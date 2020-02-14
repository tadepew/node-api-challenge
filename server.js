const express = require("express");

const actionsRouter = require("./actions/actionsRouter");

const projectsRouter = require("./projects/projectsRouter");

const server = express();

const cors = require("cors");

//global middleware
server.use(express.json());

server.use(cors());

server.get("/", (req, res) => {
  res.send(`<h2>Let's write!</h2>`);
});

server.use("/api/actions", actionsRouter);

server.use("/api/projects", projectsRouter);

module.exports = server;
