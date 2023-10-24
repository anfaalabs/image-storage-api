/// <reference types="../express-env" />

import bodyParser from "body-parser";
import cors, { type CorsOptions, type CorsOptionsDelegate } from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import helmet, { type HelmetOptions } from "helmet";
import http from "http";
import morgan from "morgan";
import path from "path";

import { ImageController } from "../src/controllers";
import { ConnectDB } from "../src/databases";
import {
    ErrorHandlerMiddleware,
    SendResponseMiddleware
} from "../src/middlewares";
import routes from "../src/routes";

// Load environment variables
dotenv.config({
    path: path.resolve(
        process.cwd(),
        "config",
        process.env.NODE_ENV === "development" ? ".env.development" : ".env"
    )
});

console.log(
    "ENV Path: ",
    path.resolve(
        process.cwd(),
        "config",
        process.env.NODE_ENV === "development" ? ".env.development" : ".env"
    )
);

// Connect MongoDB
ConnectDB(process.env.MONGODB_URL || "");

const app = express();
const server = http.createServer(app);
const allowedOrigin: string[] = process.env.ORIGINS?.split(",").map((origin) =>
    origin.trim()
) ?? ["http://localhost:3000"];
const corsOptionsDelegate: CorsOptionsDelegate = (req, callback) => {
    const corsOptions: CorsOptions = {
        origin: false
    };
    const requestOrigin = req.headers.origin || "";

    if (requestOrigin && allowedOrigin.indexOf(requestOrigin) !== -1) {
        corsOptions.origin = requestOrigin;
    }

    callback(null, corsOptions);
};
const helmetOptions: HelmetOptions = {
    crossOriginResourcePolicy: {
        policy: "cross-origin"
    }
};

/* Express Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptionsDelegate));
app.use(helmet(helmetOptions));
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(SendResponseMiddleware);

/* Ping */
app.use("/ping", (_: Request, res: Response) => {
    res.sendResponse("success", 200, {
        message: "PONG!"
    });
});

/* API Route */
app.use("/api", routes);

/* Get image by id */
app.get("/image/:id", ImageController.getImage);

/* Optional route */
app.use("*", (_req: Request, res: Response) => {
    res.sendResponse("error", 404, {
        message: "route not found"
    });
});

/* Error Handler */
app.use(ErrorHandlerMiddleware());

export default server;
