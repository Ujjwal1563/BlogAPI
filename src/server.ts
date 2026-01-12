//package import
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

// custom import
import config from "@/config";
import limiter from "@/lib/express_rate_limit";
import v1Routes from "@/routes/v1/index";
import { connectToDatabase,diconnectFromDatabase } from "@/lib/mongoose";
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
    await connectToDatabase();
    app.use('/api/v1',v1Routes);

    app.listen(config.PORT, () => {
      console.log(`Server running: http://localhost:${config.PORT}`);
    });
  } catch (err) {
    console.log('Failed to start the server', err);
    if(config.NODE_ENV==='production'){
        process.exit(1);
    }
  }
})();

const handleServerShutdown =  async()=>{
  try {
    await diconnectFromDatabase();
    console.group('Server SHUTDOWN');
    process.exit(0);
  }
  catch(err){
    console.log('Error during server shutdown',err);
  }
}

process.on('SIGTERM',handleServerShutdown);
process.on('SIGINT',handleServerShutdown);