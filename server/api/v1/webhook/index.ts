import express from "express";
import controller from "./webhook.controller";

const router = express.Router();

router.post('/account/creation', controller.accountCreation);

export default router;
