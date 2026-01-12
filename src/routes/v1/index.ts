import {Router} from 'express';
import { timeStamp } from 'node:console';
const router = Router();
router.get("/", (req, res) => {
  res.status(200).json({
    message: "API is Live",
    status:"ok",
    version:"1.0.0",
    docs:"https://docs.blog-api.ujjwalSharma.com",
    timeStamp:new Date().toISOString(),
  });
});

export default router;