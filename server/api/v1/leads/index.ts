import express from "express";
import * as auth from "../../../middlewares/authenticate";
import controller from "./leads.controller";
import { uploadWithPathMiddleware } from "../../../middlewares/file-upload";

const router = express.Router();

router.get('/', controller.get);
router.post('/', uploadWithPathMiddleware().single('file'), controller.create);
router.get('/:id', controller.getByID);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
