import { Router } from "express";
import {
  createSubmission,
  getSubmissions,
} from "../controllers/UserController";

const router = Router();

router.post("/", createSubmission); // POST /api/submissions
router.get("/", getSubmissions); // GET  /api/submissions

export default router;
