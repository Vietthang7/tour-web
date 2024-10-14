import express from "express";
const router = express.Router();

import * as controller from "../../controllers/admin/auth.controller";
import { requireAuth } from "../../middlewares/admin/auth.middleware";
import { valiPassword } from "../../validates/admin/password.validate";
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logOut);
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", controller.forgotPasswordPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);
router.get("/password/reset", requireAuth, controller.resetPassword);
router.patch("/password/reset", requireAuth,valiPassword, controller.resetPasswordPatch);
export const authRoute = router;
