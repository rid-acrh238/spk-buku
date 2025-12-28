import express from "express";
import { Login, Register } from "../controllers/AuthController.js";

const router = express.Router();

// Route Auth
router.post('/login', Login);
router.post('/register', Register);

export default router;