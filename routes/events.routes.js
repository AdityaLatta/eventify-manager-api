import { Router } from "express";
import {
    addEvent,
    deleteEvent,
    getAllEvents,
    updateEvent,
} from "../controllers/events.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { validateEventBody } from "../middlewares/validation.middleware.js";

const router = Router();

router.use(isAuthenticated);

router.get("/", getAllEvents);
router.post("/", validateEventBody, addEvent);
router.put("/:id", validateEventBody, updateEvent);
router.delete("/:id", deleteEvent);

export default router;
