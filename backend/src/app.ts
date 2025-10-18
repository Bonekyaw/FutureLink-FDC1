import express from "express";
import cookieParser from "cookie-parser";
import router from "./routes";

const app = express();

// app.set("view engine", "ejs");
// app.set("views", "src/views");

app
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cookieParser());

app.use(express.static("public"));

app.use(router);

export default app;
