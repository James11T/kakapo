import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { SERVER_CONSTANTS } from "./config.js";
import prisma from "./database.js";
import errorHandler from "./middleware/error.middleware.js";
import setRequestMetadata, { logRequest } from "./middleware/meta.middleware.js";
import timeout from "./middleware/timeout.middleware.js";
import baseRouter from "./routes/index.js";

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
