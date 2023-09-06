import { Router } from 'express';

import authRouter from './auth';
import userRouter from './user';
import rolesRouter from "./roles";
import leadsRouter from "./leads";

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/roles', rolesRouter);
router.use('/leads', leadsRouter);

export default router;
