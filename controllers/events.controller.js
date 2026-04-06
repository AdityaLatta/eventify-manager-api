import { createCalendarClient } from "../services/google/calendar.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { logger } from "../utils/winston.js";

export const getAllEvents = async (req, res) => {
    try {
        const calendar = createCalendarClient(req.googleRefreshToken);

        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const timeMin = today.toISOString();
        const timeMax = tomorrow.toISOString();

        const response = await calendar.events.list({
            calendarId: "primary",
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: "startTime",
        });

        successResponse(res, response.data.items);
    } catch (error) {
        logger.error(`Error fetching events: ${error.message}`);
        errorResponse(res, error.message, 500);
    }
};

export const addEvent = async (req, res) => {
    const event = req.body;

    try {
        const calendar = createCalendarClient(req.googleRefreshToken);
        const response = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
        });

        successResponse(res, {
            message: "Event created successfully!",
            event: response.data,
        });
    } catch (error) {
        logger.error(`Error adding event: ${error.message}`);
        errorResponse(res, error.message, 500);
    }
};

export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const updatedEvent = req.body;

    try {
        const calendar = createCalendarClient(req.googleRefreshToken);
        const response = await calendar.events.update({
            calendarId: "primary",
            eventId: id,
            resource: updatedEvent,
        });

        successResponse(res, {
            message: "Event updated successfully!",
            event: response.data,
        });
    } catch (error) {
        logger.error(`Error updating event: ${error.message}`);
        errorResponse(res, error.message, 500);
    }
};

export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const calendar = createCalendarClient(req.googleRefreshToken);
        await calendar.events.delete({
            calendarId: "primary",
            eventId: id,
        });

        successResponse(res, { message: "Event deleted successfully!" });
    } catch (error) {
        logger.error(`Error deleting event: ${error.message}`);
        errorResponse(res, error.message, 500);
    }
};
