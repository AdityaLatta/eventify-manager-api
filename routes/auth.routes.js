import { Router } from "express";
import {
    auth,
    login,
    logout,
    updateDiscord,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);

router.get("/", auth);

router.post("/logout", logout);

router.post("/update-discord", updateDiscord);

export default router;
