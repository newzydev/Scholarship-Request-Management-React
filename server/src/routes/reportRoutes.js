import { Router } from 'express';
import { summary, details, exportExcel } from '../controllers/reportController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/summary', summary);
router.get('/details', details);
router.get('/export', exportExcel);

export default router;
