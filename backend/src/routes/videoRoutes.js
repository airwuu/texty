// backend/src/routes/videoRoutes.js
import express from 'express';
import { generateVideo } from '../controllers/videoController.js';

const router = express.Router();

router.post('/generate-video', generateVideo);

export default router;