import { Router } from 'express';
import { list, getOne, create, update, changeStatus, remove } from '../controllers/requestController.js';
import { requireAuth } from '../middlewares/auth.js';
import { scholarshipRequestRules } from '../middlewares/requestValidators.js';
import { handleValidation } from '../middlewares/validate.js';

const router = Router();

router.use(requireAuth);

router.get('/', list);
router.get('/:id', getOne);
router.post('/', scholarshipRequestRules(true), handleValidation, create);
router.put('/:id', scholarshipRequestRules(false), handleValidation, update);
router.patch('/:id/status', changeStatus);
router.delete('/:id', remove);

export default router;
