import { Router } from 'express';

import userRouter from './users';
import checklistRouter from './checklists';
import itemRouter from './items';

const router = Router();

router.use('/users', userRouter);
router.use('/checklists', checklistRouter);
router.use('/items', itemRouter);

export default router;
