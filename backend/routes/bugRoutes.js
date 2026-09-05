import { Router } from "express";
import {
  createBug,
  deleteBug,
  getBug,
  getBugs,
  updateBug,
} from "../controllers/bugController.js";

const router = Router();

router.route("/").get(getBugs).post(createBug);
router.route("/:id").get(getBug).put(updateBug).delete(deleteBug);

export default router;
