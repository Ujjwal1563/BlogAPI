//package import
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

// custom import
import config from "@/config";
import limiter from "@/lib/express_rate_limit";
import type { CorsOptions } from "cors";

const app = express();

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === "development" ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS error: ${origin} is not allowed by CORS`),
        false
      );
      console.log(`CORS error: ${origin} is not allowed by CORS`);
    }
  },
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(
  compression({
    threshold: 1024, // only compress responses larger than 1KB
  })
);

app.use(helmet());
app.use(limiter);
(async () => {
  try {
    app.get("/", (req, res) => {
      res.json({
        message: "Hello World",
      });
      app.listen(config.PORT, () => {
        console.log(`Server running: http://localhost:${config.PORT}`);
      });
    });
  } catch (err) {
    console.log('Failed to start the server', err);
    if(config.NODE_ENV==='production'){
        process.exit(1);
    }
  }
})();
