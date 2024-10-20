"use strict";

const payloadJWT = (object) => {
    return {
        userId: object._id,
        email: object.email,
    };
};

export { payloadJWT };
