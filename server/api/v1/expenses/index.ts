import express from "express";
import controller from "./expenses.controller";

const router = express.Router();

router.get('/', controller.get);
router.get('/payroll/calculate', controller.getPayrollCalculate);
router.post('/', controller.create);
router.post('/payroll', controller.getPayroll);
router.post('/pay/to/payroll', controller.payToPayroll);
router.get('/:id', controller.getByID);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
