import cors from "cors";
import express from "express";
import errorHandler from "./middlewares/error.middleware";
import router from "./routes";

const app = express();

const allowedOrigins = ["http://localhost:3000", "live-url-will-go-here"];

// global middleware configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());

// handle routes
app.use("/api/v1", router);

// handle global error
app.use(errorHandler);

export default app;
