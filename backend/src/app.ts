import express from "express";

import router from "./routes";

const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(router);

export default app;
