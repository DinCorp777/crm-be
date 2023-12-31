import express from "express";
import * as auth from "../../../middlewares/authenticate";
import controller from "./auth.controller";

const router = express.Router();

router.get('/me', auth.isAuthenticated(), controller.getLoggedInUser);
router.post('/login', controller.login);
router.post('/forget-password', controller.forgotPassword);
router.post('/reset-password/:id', controller.resetPassword);
router.post('/action/perform/reset-password', controller.resetPasswordPerform);

export default router;
