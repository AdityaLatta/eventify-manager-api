import { Router } from "express";
import {
    auth,
    login,
    logout,
    setToken,
    updateDiscord,
    webhook,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);

router.get("/", auth);

router.post("/set-token", setToken);

router.post("/logout", logout);

router.post("/update-discord", updateDiscord);

router.post("/webhook", webhook);

export default router;
