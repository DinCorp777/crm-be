import express from "express";
import controller from "./reports.controller";

const router = express.Router();

router.post('/leaderboard/setter', controller.getSetter);
router.post('/leaderboard/rep/closer', controller.getCloser);

export default router;
