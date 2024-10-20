"use strict";
import mongoose from "mongoose";

const DEV = true;
const stringConnect = "mongodb://localhost:27017/ShopDev";

class Database {
    constructor() {
        this.connect();
    }

    async connect() {
        //! Example env DEV
        if (DEV === true) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }
        try {
            await mongoose.connect(stringConnect);
            console.log("SUCCESS <3");
        } catch (error) {
            console.log(error);
        }
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceDB = Database.getInstance();

export default instanceDB;
