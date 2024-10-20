"use strict";
import app from "./src/app.js";
import ENV from "./src/env/config.env.js";
import process from "process";

const PORT = ENV.PORT;

//
const server = app.listen(PORT, () => {
    console.log(`Listen at PORT: http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
    server.close(() => {
        console.log("Shutdown Express !!!");
    });
});
