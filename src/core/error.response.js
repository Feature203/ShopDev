"use strict";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

class ErrorResponse extends Error {
    constructor(message = "ERROR", status = StatusCodes.ACCEPTED) {
        super(message);
        this.status = status;
    }
}

class BadRequest extends ErrorResponse {
    constructor(
        message = ReasonPhrases.BAD_REQUEST,
        status = StatusCodes.BAD_REQUEST
    ) {
        super(message, status);
    }
}

class ConflictRequest extends ErrorResponse {
    constructor(
        message = ReasonPhrases.CONFLICT,
        status = StatusCodes.CONFLICT
    ) {
        super(message, status);
    }
}

class FORBIDDEN extends ErrorResponse {
    constructor(
        message = ReasonPhrases.FORBIDDEN,
        status = StatusCodes.FORBIDDEN
    ) {
        super(message, status);
    }
}

class AuthFailure extends ErrorResponse {
    constructor(
        message = ReasonPhrases.ACCEPTED,
        status = StatusCodes.ACCEPTED
    ) {
        super(message, status);
    }
}
export { ErrorResponse, BadRequest, ConflictRequest, FORBIDDEN, AuthFailure };
