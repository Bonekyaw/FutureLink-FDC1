import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello FutureLink");
});

app.get("/login", (req, res) => {
  res.send("<h1>Hello Login<h1>");
});

export default app;
