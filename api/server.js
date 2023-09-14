const express = require("express");
const jokesRouter=require('./jokesRouter')
const server = express();
server.use(express.json());

server.use("/jokes",jokesRouter)
module.exports = server;