"use strict";
import ApiKeyService from "../services/apiKey.service.js";

const HEADER = {
    API_KEY: "x_api_key",
};

class CheckAuth {
    static async apiKey(req, res, next) {
        //! check x_api_key
        const api_key = req.headers[HEADER.API_KEY];
        if (!api_key)
            return res.status(400).json({
                code: 400,
                msg: " ERROR FORBIDDEN",
            });
        //! check apiKey
        const objKey = await ApiKeyService.findByKey(api_key);
        //!
        if (!objKey)
            return res.status(400).json({
                code: 400,
                msg: " ERROR FORBIDDEN API KEY CORRECT",
            });
        req.objKey = objKey;

        console.log(req);
        return next();
    }

    static checkPremission(premission) {
        //! find premission
        return (req, res, next) => {
            //! Find Pre
            const findPre = req.objKey.premissions;
            if (!findPre) {
                return res.status(400).json({
                    code: 400,
                    msg: " ERROR FORBIDDEN premissions",
                });
            }
            //! Check Pre
            const checkPre = req.objKey.premissions.includes(premission);
            if (!checkPre) {
                return res.status(400).json({
                    code: 400,
                    msg: " ERROR FORBIDDEN premissions CORRECT",
                });
            }

            return next();
        };
    }
}

export default CheckAuth;
