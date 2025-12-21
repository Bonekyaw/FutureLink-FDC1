import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes";
import limiter from "./middleware/rateLimiter";
import helmet from "helmet";
import compression from "compression";

const app = express();

// app.set("view engine", "ejs");
// app.set("views", "src/views");

app
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cookieParser())
  .use(cors())
  .use(helmet())
  .use(compression())
  .use(limiter);

app.use(express.static("public"));

app.use(router);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const errorCode = error.code || "Error_Code";
  const message = error.message || "Server Error";
  res.status(status).json({ message, error: errorCode });
});

export default app;
