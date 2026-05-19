import winston  from "winston";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

export const logger = winston.createLogger({
    level: "info",
    format: isProd
        ? winston.format.json()
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ level, message, timestamp }) => {
                return `[${timestamp}] ${level}: ${JSON.stringify(message, null, 2)}`;
            })
        ),
    transports: [new winston.transports.Console()],
});