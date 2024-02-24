import { createLogger, format, transports } from "winston";
import * as dotenv from "dotenv";
dotenv.config();

const env = process.env.ENV;

// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatParams = (info: any) => {
  const { timestamp, level, message, ...args } = info;
  const ts = timestamp.slice(0, 19).replace("T", " ");

  return `${ts} ${level}:${message} ${Object.keys(args).length ? JSON.stringify(args) : ""}`;
};

const Format = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(formatParams),
);

const transportArray =
  env === "production"
    ? [
        new transports.File({
          filename: "candidateMicroserviceLogs.log",
          level: "info",
        }),
      ]
    : [new transports.Console()];

const logger = createLogger({
  level: "info",
  format: Format,
  transports: transportArray,
});

export default logger;
