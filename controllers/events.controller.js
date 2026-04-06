import { createCalendarClient } from "../services/google/calendar.service.js";

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

        res.json(response.data.items);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        res.json({
            message: "Event created successfully!",
            event: response.data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        res.json({
            message: "Event updated successfully!",
            event: response.data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        res.json({ message: "Event deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
