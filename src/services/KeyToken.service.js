"use strict";
import { Types } from "mongoose";
import keyTokenModel from "../model/keyToken.model.js";

class KeyTokenService {
    static async createKeyToken({
        userId,
        privateKey,
        publicKey,
        refreshToken,
    }) {
        //! lv0
        // const publicKeyString = publicKey.toString();
        // const tokens = await keyTokenModel.create({
        //     user: userId,
        //     privateKey,
        //     publicKey: publicKeyString,
        // });
        //!lv xxxx
        const filter = {
                user: userId,
            },
            update = {
                privateKey,
                publicKey,
                refreshToken,
            },
            options = {
                new: true,
                upsert: true,
            };

        const tokens = await keyTokenModel.findOneAndUpdate(
            filter,
            update,
            options
        );

        return tokens ? tokens : null;
    }

    static async findByUserId({ userId }) {
        return await keyTokenModel.findOne({ user: userId });
    }

    static async removeKey(user) {
        return await keyTokenModel.deleteOne({
            user: new Types.ObjectId(user),
        });
    }

    static async findRefreshTokenUsed(refreshToken) {
        return await keyTokenModel
            .findOne({ refreshTokenUsed: refreshToken })
            .lean();
    }

    static async findRefreshToken(refreshToken) {
        return await keyTokenModel.findOne({ refreshToken: refreshToken });
    }

    static async deleteToken(refreshToken) {
        return await keyTokenModel
            .deleteOne({ refreshTokenUsed: refreshToken })
            .lean();
    }
}

export default KeyTokenService;
