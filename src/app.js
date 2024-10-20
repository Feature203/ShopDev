"use strict";
import express from "express";
const app = express();
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes/index.routes.js";
import instanceDB from "./database/init.mongodb.js";

//! middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
//! Database
instanceDB;
//!routes
routes(app);
//! handle error
app.use((req, res, next) => {
    const err = new Error("Not Found !");
    err.status = 404;
    next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const msg = err.message || "Internal Server !";
    return res.status(err.status || 500).json({
        code: err.status || 500,
        msg,
        stack: err.stack,
    });
});

export default app;
