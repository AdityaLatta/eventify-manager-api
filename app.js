import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";

import authRoutes from "./routes/auth.routes.js";
import eventsRoutes from "./routes/events.routes.js";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);

app.listen(3000, () => console.log(`Server running on port ${port}`));
