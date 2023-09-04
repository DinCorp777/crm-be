import express from "express";
import controller from "./appointment.controller";

const router = express.Router();

router.get('/', controller.get);
router.post('/', controller.create);
router.get('/:id', controller.getByID);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.delete('/leads/:id/:uId', controller.updateLeadAndDelete);

export default router;
