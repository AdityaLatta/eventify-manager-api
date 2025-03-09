import { Router } from "express";
import {
    auth,
    checkAuth,
    getUserInfo,
    login,
    logout,
    updateDiscord,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);

router.get("/", auth);

router.get("/check-auth", checkAuth);

router.get("/get-user", getUserInfo);

router.post("/logout", logout);

router.post("/update-discord", updateDiscord);

export default router;
