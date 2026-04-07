import { Router } from "express";
import {
    auth,
    login,
    logout,
    setToken,
    updateDiscord,
    webhook,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/login", login);

router.get("/", auth);

router.post("/set-token", setToken);

router.post("/logout", logout);

router.post("/update-discord", isAuthenticated, updateDiscord);

router.post("/webhook", webhook);

export default router;
