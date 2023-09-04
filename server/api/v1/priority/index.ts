import express from "express";
import controller from "./priority.controller";

const router = express.Router();

router.get('/all/closers/:id', controller.getAllClosers);
router.get('/all/closers/reset/count', controller.resetCount);
router.post('/update/priority/list', controller.updatePriorityList);
router.post('/update/user/location/to/current', controller.updatePriorityUserLocation);
router.post('/remove/user/from/the/rotation/list', controller.removeUserFromTheRotationList);
router.put('/update/closer/:id', controller.updateCloserCount);

export default router;
