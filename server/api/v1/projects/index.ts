import express from "express";
import controller from "./projects.controller";

const router = express.Router();

router.get('/', controller.get);
router.get('/all/accounts', controller.getProjectAccounts);
router.post('/', controller.create);
router.get('/:id', controller.getByID);
router.put('/leads/:id', controller.leadProjects);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
