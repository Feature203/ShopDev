"use strict";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

class SuccessReponse {
    constructor({
        message = ReasonPhrases.OK,
        status = StatusCodes.OK,
        metaData = {},
    }) {
        this.message = message;
        this.status = status;
        this.metaData = metaData;
    }

    send(res) {
        return res.status(this.status).json(this);
    }
}

class CREATED extends SuccessReponse {
    constructor({
        message = ReasonPhrases.CREATED,
        status = StatusCodes.CREATED,
        metaData,
    }) {
        super({ message, status, metaData });
    }
}

class OK extends SuccessReponse {
    constructor({
        message = ReasonPhrases.OK,
        status = StatusCodes.OK,
        metaData,
    }) {
        super({ message, status, metaData });
    }
}

export { SuccessReponse, CREATED, OK };
