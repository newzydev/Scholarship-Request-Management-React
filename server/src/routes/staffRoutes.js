import { Router } from 'express';
import { list, getOne, create, update, remove } from '../controllers/staffController.js';
import { requireAuth } from '../middlewares/auth.js';
import { staffCreateRules, staffUpdateRules } from '../middlewares/staffValidators.js';
import { handleValidation } from '../middlewares/validate.js';

const router = Router();

router.use(requireAuth);

router.get('/', list);
router.get('/:id', getOne);
router.post('/', staffCreateRules, handleValidation, create);
router.put('/:id', staffUpdateRules, handleValidation, update);
router.delete('/:id', remove);

export default router;
