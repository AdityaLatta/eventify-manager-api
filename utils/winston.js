import winston from "winston";

const customColors = {
    error: "red",
    warn: "yellow",
    info: "cyan",
    http: "magenta",
    debug: "green",
};

winston.addColors(customColors);

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
});

export const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.colorize(),
        logFormat
    ),
    transports: [new winston.transports.Console()],
});
