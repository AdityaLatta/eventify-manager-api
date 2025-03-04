import { Router } from "express";
import { auth, login, logout } from "../controllers/auth.controller.js";

const router = Router();

router.get("/login", login);

router.get("/", auth);

router.get("/logout", logout);

export default router;
