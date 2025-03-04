import express from "express";
import {
    addEvent,
    deleteEvent,
    getAllEvents,
    updateEvent,
} from "../controllers/events.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/").get(getAllEvents).post(addEvent);
router.route("/:id").put(updateEvent).delete(deleteEvent);

export default router;
