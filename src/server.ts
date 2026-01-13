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
import {logger} from '@/lib/winston';
// types import 
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
      logger.warn(`CORS error: ${origin} is not allowed by CORS`);
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
      logger.info(`Server running: http://localhost:${config.PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start the server', err);
    if(config.NODE_ENV==='production'){
        process.exit(1);
    }
  }
})();

const handleServerShutdown =  async()=>{
  try {
    await diconnectFromDatabase();
    logger.warn('Server SHUTDOWN');
    process.exit(0);
  }
  catch(err){
    logger.error('Error during server shutdown',err);
  }
}

process.on('SIGTERM',handleServerShutdown);
process.on('SIGINT',handleServerShutdown);