"use strict";
import bcrypt, { genSalt } from "bcrypt";
import {
    AuthFailure,
    ErrorResponse,
    FORBIDDEN,
} from "../core/error.response.js";
import shopModel from "../model/shop.model.js";
import { getInfoData } from "../utils/getInfoData.js";
import KeyTokenService from "./keyToken.service.js";
import AuthUtils from "../auth/authUtils.js";
import ShopService from "./shop.service.js";
import { genatorPrivateKey, genatorPublicKey } from "../helpers/genatorKey.js";
import { payloadJWT } from "../helpers/payloadJWT.js";

class AccessService {
    //! handleRefreshToken
    static async handleRefreshTokenv2({ keyStore, user, refreshToken }) {
        //* Check RT
        if (keyStore.refreshToken !== refreshToken)
            throw new AuthFailure("Shop not register 1");

        const { userId, email } = user;
        // * FOUND shop
        const foundShop = await ShopService.findByEmail({ email });
        if (!foundShop) throw new AuthFailure("Shop not register 2");

        // * Nếu RT có trong RT.Used => RT đã được dùng 1 lần => DELETE
        //! check refreshTokenUsed
        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.deleteToken(refreshToken);
            throw new FORBIDDEN("Something wrong happend ? Please ReLogin");
        }

        const tokens = await AuthUtils.createTokenPair({
            payload: payloadJWT(foundShop),
            privateKey: keyStore.privateKey,
            publicKey: keyStore.publicKey,
        });

        //! Update
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokenUsed: refreshToken,
            },
        });

        return { user: { userId, email }, tokens };
    }

    // > handleRefreshToken v3
    static async handleRefreshTokenv3({ user, keyStore, refreshToken }) {
        // * Check RT Used
        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            //! Delete token
            await KeyTokenService.deleteToken(refreshToken);
            throw new AuthFailure(
                "ERROR: Something happend. Please Relogin !!!"
            );
        }
        // * Check RT
        if (keyStore.refreshToken !== refreshToken)
            throw new AuthFailure("Shop not register 1");

        // * found shop
        const { userId } = user;
        const foundShop = await ShopService.findByShopId({ _id: userId });
        if (!foundShop) throw new AuthFailure("ERROR:Shot not register 2");

        // * create tokens new
        const tokens = await AuthUtils.createTokenPair({
            payload: payloadJWT(foundShop),
            privateKey: keyStore.privateKey,
            publicKey: keyStore.publicKey,
        });
        //* Create Done. => Update
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokenUsed: refreshToken,
            },
        });
        return {
            user,
            tokens,
        };
    }

    //! LOGOUT
    static async logout({ user }) {
        const delKey = await KeyTokenService.removeKey(user);
        console.log(delKey);
        return delKey;
    }
    //! LOGIN
    static async login({ email, password }) {
        //! Check Exists
        const foundShop = await ShopService.findByEmail({ email });
        console.log(foundShop);
        if (!foundShop) throw new ErrorResponse("Please Register !");
        //!Match password
        const matchPassword = await bcrypt.compare(
            password,
            foundShop.password
        );
        if (!matchPassword) throw new ErrorResponse("Password Correct !!!");
        //! create privateKey and publicKey => tokens
        const privateKey = genatorPrivateKey();
        const publicKey = genatorPublicKey();

        //! lay refreshToken
        const tokens = await AuthUtils.createTokenPair({
            payload: payloadJWT(foundShop),
            privateKey,
            publicKey,
        });

        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            privateKey,
            publicKey,
            refreshToken: tokens.refreshToken,
        });

        return {
            data: getInfoData(foundShop, ["_id", "name", "email"]),
            tokens,
        };
    }
    //! REGISTER
    static async register({ name, email, password }) {
        //! Check Exists
        const nameExists = await shopModel.exists({ name }).lean();
        const emailExists = await shopModel.exists({ email }).lean();

        if (nameExists) throw new ErrorResponse("ERROR:Name Exist");
        if (emailExists) throw new ErrorResponse("ERROR:Email Exist");

        //!Hash password
        const salt = await genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //! Register
        const newShop = await shopModel.create({
            name,
            email,
            password: hashPassword,
        });

        if (newShop) {
            //! Create PrivateKey,PublicKey
            // const { publicKey, privateKey } = crypto.generateKeyPairSync(
            //     "rsa",
            //     {
            //         modulusLength: 4096,
            //         publicKeyEncoding: {
            //             format: "pem",
            //             type: "pkcs1",
            //         },
            //         privateKeyEncoding: {
            //             format: "pem",
            //             type: "pkcs1",
            //         },
            //     }
            // );
            const privateKey = genatorPrivateKey();
            const publicKey = genatorPublicKey();
            //! Save privateKey PublicKey => JWT
            await KeyTokenService.createKeyToken({
                userId: newShop._id,
                privateKey,
                publicKey,
            });

            const tokens = await AuthUtils.createTokenPair({
                payload: payloadJWT(newShop),
                publicKey,
                privateKey,
            });
            return {
                data: getInfoData(newShop, ["_id", "name", "email"]),
                tokens,
            };
        }

        return {
            code: 402,
            msg: "Error Register ",
        };
    }
}

export default AccessService;
