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

var whitelist = ["http://example1.com", "http://localhost:5173"];
var corsOptions = {
  origin: function (
    origin: any,
    callback: (err: Error | null, origin?: any) => void
  ) {
    // Allow requests with no origin ( like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies or authorization header
};

app
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cookieParser())
  .use(cors(corsOptions))
  .use(helmet())
  .use(compression())
  .use(limiter);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});
app.use(express.static("public"));
app.use(express.static("uploads"));

app.use(router);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const errorCode = error.code || "Error_Code";
  const message = error.message || "Server Error";
  res.status(status).json({ message, error: errorCode });
});

export default app;
