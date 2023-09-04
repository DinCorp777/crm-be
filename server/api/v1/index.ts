import { Router } from 'express';

import authRouter from './auth';
import userRouter from './user';
import rolesRouter from "./roles";
import leadsRouter from "./leads";
import appointmentRouter from "./appointment";
import locationRouter from "./location";
import repCommissionRouter from "./rep-commission";
import notificationRouter from "./notifications";
import projectsRouter from "./projects";
import expensesCategoryRouter from "./expensesCategory";
import priorityRouter from "./priority";
import reportsRouter from "./reports";
import expensesRouter from "./expenses";
import webhookRouter from "./webhook";
import projectAccountFieldsRouter from "./projectAccountFields";

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/roles', rolesRouter);
router.use('/leads', leadsRouter);
router.use('/appointment', appointmentRouter);
router.use('/location', locationRouter);
router.use('/repcommission', repCommissionRouter);
router.use('/notification', notificationRouter);
router.use('/projects', projectsRouter);
router.use('/expenses-category', expensesCategoryRouter);
router.use('/priority', priorityRouter);
router.use('/reports', reportsRouter);
router.use('/expenses', expensesRouter);
router.use('/webhook', webhookRouter);
router.use('/projectAccountFields', projectAccountFieldsRouter);


export default router;
