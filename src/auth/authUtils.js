"use strict";
import JWT from "jsonwebtoken";
import { AuthFailure, FORBIDDEN } from "../core/error.response.js";
import KeyTokenService from "../services/keyToken.service.js";

const HEADER = {
    CLIENT_ID: "x_client_id",
    AUTHORZITION: "authorzition",
    REFRESHTOKEN: "x_rtoken_id",
};

class AuthUtils {
    static async createTokenPair({ payload, publicKey, privateKey }) {
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: "RS256",
            expiresIn: "2d",
        });
        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: "RS256",
            expiresIn: "2d",
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) console.log(err);
            console.log("DECODE: ", decode);
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    static async authenzication(req, res, next) {
        //!Check X_CLIENT_ID
        const userId = req.headers[HEADER.CLIENT_ID];
        if (!userId) throw new FORBIDDEN("ERROR: X_CLIENT_ID");
        //!found User ID => KeyToken
        const token = await KeyTokenService.findByUserId({ userId });
        if (!token)
            throw new AuthFailure("ERROR: NO FOUND authenzition ACCESSTOKEN");
        //! accessToken
        const accessToken = req.headers[HEADER.AUTHENZICATION];
        if (!accessToken) throw new AuthFailure("ERROR: authorzition");

        try {
            const decodeUserId = JWT.verify(accessToken, token.publicKey);
            console.log(decodeUserId);
            if (decodeUserId.userId !== userId) {
                throw new AuthFailure("ERROR USER ID");
            }

            req.keyStore = decodeUserId;
            return next();
        } catch (error) {
            next(error);
        }
    }

    static async authenzication2(req, res, next) {
        //!Check X_CLIENT_ID

        const userId = req.headers[HEADER.CLIENT_ID];
        if (!userId) throw new FORBIDDEN("ERROR: X_CLIENT_ID");
        //!found User ID => KeyToken

        // 2 throw KeyToken privateKey,publicKey in Database
        const keyStore = await KeyTokenService.findByUserId({ userId });

        if (!keyStore)
            throw new AuthFailure("ERROR: NO FOUND authenzition ACCESSTOKEN");

        //  3
        if (req.headers[HEADER.REFRESHTOKEN]) {
            try {
                const refreshToken = req.headers[HEADER.REFRESHTOKEN];
                const decodeUser = JWT.verify(
                    refreshToken,
                    keyStore.privateKey
                );
                if (userId !== decodeUser.userId)
                    throw new AuthFailure("Invalid User");

                req.keyStore = keyStore;
                req.user = decodeUser;
                req.refreshToken = refreshToken;

                return next();
            } catch (error) {
                next(error);
            }
        }

        const accessToken = req.headers[HEADER.AUTHORZITION];
        if (!accessToken) throw new AuthFailure("ERROR: accessToken");
        console.log(keyStore.publicKey);
        try {
            const decodeUserId = JWT.verify(accessToken, keyStore.publicKey);
            console.log(decodeUserId);
            if (decodeUserId.userId !== userId) {
                throw new AuthFailure("ERROR USER ID");
            }

            req.keyStore = decodeUserId;

            return next();
        } catch (error) {
            next(error);
        }
    }

    static async authenzicationv3(req, res, next) {
        // *  Check ClientID
        const userId = req.headers[HEADER.CLIENT_ID];
        if (!userId) throw new FORBIDDEN(`ERROR: ${HEADER.CLIENT_ID}`);

        // * userId => Model {privateKey,publicKey}
        const keyStore = await KeyTokenService.findByUserId({ userId });
        if (!keyStore) throw new AuthFailure("ERROR: userId");

        //> HANDLE REFRESHTOKEN
        // TODO: Req.user => cant RefreshToken
        if (req.headers[HEADER.REFRESHTOKEN]) {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);

            if (decodeUser.userId !== userId)
                throw AuthFailure(`ERROR: ${HEADER.REFRESHTOKEN}`);

            // * Cast to headers
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;

            // * return

            return next();
        }

        //> HANDLE authorzition

        if (req.headers[HEADER.AUTHORZITION]) {
            const accesstoken = req.headers[HEADER.AUTHORZITION];

            const decodeUser = JWT.verify(accesstoken, keyStore.publicKey);

            if (decodeUser.userId !== userId)
                throw AuthFailure(`ERROR: ${HEADER.AUTHORZITION}`);

            req.keyStore = keyStore;

            return next();
        }

        return res.status(400).json({
            code: 400,
            msg: `FORBIDDEN ${req.headers[HEADER.AUTHORZITION] || req.headers[HEADER.REFRESHTOKEN]}`,
            error: `No Find ${HEADER.AUTHORZITION} or ${HEADER.REFRESHTOKEN}`,
        });
    }
    static verifyJWT(token, secret) {
        return JWT.verify(token, secret);
    }
}

export default AuthUtils;
