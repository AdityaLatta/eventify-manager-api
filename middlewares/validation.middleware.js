export function validateEventBody(req, res, next) {
    const { summary, start, end } = req.body;
    
    if (!summary || typeof summary !== "string" || summary.trim() === "") {
        return res.status(400).json({ message: "Invalid or missing 'summary'" });
    }

    if (!start || (!start.dateTime && !start.date)) {
        return res.status(400).json({ message: "Invalid or missing 'start' object (must contain dateTime or date)" });
    }

    if (!end || (!end.dateTime && !end.date)) {
        return res.status(400).json({ message: "Invalid or missing 'end' object (must contain dateTime or date)" });
    }

    next();
}
