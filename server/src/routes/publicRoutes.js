import { Router } from 'express';
import { getScholarshipTypes, getBanks, submitRequest } from '../controllers/publicController.js';
import { scholarshipRequestRules } from '../middlewares/requestValidators.js';
import { handleValidation } from '../middlewares/validate.js';

const router = Router();

router.get('/scholarship-types', getScholarshipTypes);
router.get('/banks', getBanks);
router.post('/scholarship-requests', scholarshipRequestRules(true), handleValidation, submitRequest);

export default router;
