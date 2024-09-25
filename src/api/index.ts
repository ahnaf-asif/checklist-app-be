import { Router } from 'express';

import userRouter from './users';
import checklistRouter from './checklists';

const router = Router();

router.use('/users', userRouter);
router.use('/checklists', checklistRouter);

export default router;
