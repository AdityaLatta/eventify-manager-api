import { createCalendarClient, PRIMARY_CALENDAR } from "../services/google/calendar.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllEvents = asyncHandler(async (req, res) => {
    const calendar = createCalendarClient(req.googleRefreshToken);

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const timeMin = today.toISOString();
    const timeMax = tomorrow.toISOString();

    const response = await calendar.events.list({
        calendarId: PRIMARY_CALENDAR,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: "startTime",
    });

    successResponse(res, response.data.items);
});

export const addEvent = asyncHandler(async (req, res) => {
    const event = req.body;

    const calendar = createCalendarClient(req.googleRefreshToken);
    const response = await calendar.events.insert({
        calendarId: PRIMARY_CALENDAR,
        resource: event,
    });

    successResponse(res, {
        message: "Event created successfully!",
        event: response.data,
    });
});

export const updateEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedEvent = req.body;

    if (!id || typeof id !== "string" || !/^[\w-]+$/.test(id)) {
        return errorResponse(res, "Invalid event ID format", 400);
    }

    const calendar = createCalendarClient(req.googleRefreshToken);
    const response = await calendar.events.update({
        calendarId: PRIMARY_CALENDAR,
        eventId: id,
        resource: updatedEvent,
    });

    successResponse(res, {
        message: "Event updated successfully!",
        event: response.data,
    });
});

export const deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || typeof id !== "string" || !/^[\w-]+$/.test(id)) {
        return errorResponse(res, "Invalid event ID format", 400);
    }

    const calendar = createCalendarClient(req.googleRefreshToken);
    await calendar.events.delete({
        calendarId: PRIMARY_CALENDAR,
        eventId: id,
    });

    successResponse(res, { message: "Event deleted successfully!" });
});
