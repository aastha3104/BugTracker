import { Router } from "express";
import { getUserStats, getUsers } from "../controllers/userController.js";
import { requireAdmin, requireUser } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/stats", requireUser, getUserStats);
router.get("/", requireAdmin, getUsers);

export default router;