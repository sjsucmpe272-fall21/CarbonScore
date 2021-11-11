const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const app = express();
const host = "localhost";
const port = 3002;
const mongoDBUrl = "mongodb://localhost:3001/mongodb";

app.use(
  cors({
    allowedHeaders: ["sessionId", "Content-Type"],
    exposedHeaders: ["sessionId"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);
app.options("*", cors());

mongoose.connect(mongoDBUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/api/test1", (req, res) => {
  try {
    return "test1";
  } catch (err) {
    next(err);
  }
  return res.json();
});

app.post("/api/test2", (req, res) => {
  try {
    return "test2";
  } catch (err) {
    next(err);
  }
  return res.json(uriKey);
});

app.listen(port, host, () => {
  console.log(`Server listening on the port ${port}`);
});
