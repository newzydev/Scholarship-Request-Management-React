import { Router } from 'express';
import { summary } from '../controllers/dashboardController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/summary', requireAuth, summary);

export default router;
