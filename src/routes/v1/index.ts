import {Router} from 'express';
import { timeStamp } from 'node:console';
const router = Router();

import authRoutes from '@/routes/v1/auth';
router.get("/", (req, res) => {
  res.status(200).json({
    message: "API is Live",
    status:"ok",
    version:"1.0.0",
    docs:"https://docs.blog-api.ujjwalSharma.com",
    timeStamp:new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);

export default router;