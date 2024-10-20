"use strict";
import { CREATED, OK, SuccessReponse } from "../core/succes.response.js";
import AccessService from "../services/access.service.js";

class AccessController {
    //! handle refreshToken
    static async handleRefreshToken(req, res) {
        //! V1
        // return new OK({
        //     message: "Get Tokens SuccessFully",
        //     metaData: await AccessService.handleRefreshToken(
        //         req.body.refreshToken
        //     ),
        // }).send(res);
        // ! V2
        return new SuccessReponse({
            message: "Get Tokens SuccessFully",
            metaData: await AccessService.handleRefreshTokenv3({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore,
            }),
        }).send(res);
    }
    //! LOGOUT
    static async logout(req, res) {
        return new OK({
            message: "LOGOUT SuccessFully",
            metaData: await AccessService.logout(req.keyStore),
        }).send(res);
    }
    //!LOGIN
    static async login(req, res) {
        return new OK({
            message: "Login SuccessFully",
            metaData: await AccessService.login(req.body),
        }).send(res);
    }
    //! REGISTER
    static async register(req, res) {
        return new CREATED({
            message: "Created SuccessFully",
            metaData: await AccessService.register(req.body),
        }).send(res);
    }
}

export default AccessController;
