import { Router } from "express";
import { adminLogin, login, signup } from "../controllers/authController.js";

const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/admin-login", adminLogin);

export default router;
