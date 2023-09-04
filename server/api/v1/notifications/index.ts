import express from "express";
import controller from "./notifications.controller";
import * as auth from "../../../middlewares/authenticate";

const router = express.Router();

router.get('/', controller.get);
router.get('/single/message/obj/by/:id', controller.singleMessageObjById);
router.get('/all/notifications', auth.isAuthenticated(), controller.getAllNotifications);
router.get('/all/messages', auth.isAuthenticated(), controller.getAllMessages);
router.get('/all/tasks', auth.isAuthenticated(), controller.getAllTasks);
router.post('/add/lead/note', auth.isAuthenticated(), controller.addLeadNote);
router.post('/', auth.isAuthenticated(), controller.create);
router.get('/:id', controller.getByID);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
