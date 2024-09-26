import { Router } from 'express';

import userRouter from './users';
import checklistRouter from './checklists';
import itemRouter from './items';
import groupRouter from './groups';

const router = Router();

router.use('/users', userRouter);
router.use('/checklists', checklistRouter);
router.use('/items', itemRouter);
router.use('/groups', groupRouter);

export default router;
