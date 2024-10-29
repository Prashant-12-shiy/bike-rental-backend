import express from "express";
import AuthController from "../controller/AuthController";
import {validateSignup} from "../middleware/validation"

const router = express.Router();

router.post("/signup", validateSignup, AuthController.signup);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

export default router;