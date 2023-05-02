import cors from "cors";
import helmet from "helmet";
import express from "express";
import prisma from "./database";
import baseRouter from "./routes";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error.middleware";
import setRequestMetadata, { logRequest } from "./middleware/meta.middleware";
import timeout from "./middleware/timeout.middleware";
import { SERVER_CONSTANTS } from "./config";

const app = express();

app.use(setRequestMetadata);
app.use(express.urlencoded({ extended: true })); // Parse forms
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(cors()); // Allow all cross-origin requests
app.use(helmet());
app.use(logRequest);
app.use(timeout(SERVER_CONSTANTS.RESPONSE_TIMEOUT));

app.disable("x-powered-by"); // Disable X-Powered-By header

app.use("/api/v1", baseRouter);

app.use(errorHandler);

app.use("*", (req, res) =>
  res.status(404).json({ error: "UNKNOWN_ROUTE", message: "Unknown route." })
);

process.on("exit", () => {
  prisma.$disconnect();
});

export default app;
