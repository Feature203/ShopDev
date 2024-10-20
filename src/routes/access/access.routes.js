import express from "express";
const router = express.Router();
import AccessController from "../../controllers/AccessController.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import CheckAuth from "../../auth/checkAuth.js";
import AuthUtils from "./../../auth/authUtils.js";

//! AUTHENTICATION
router.use(CheckAuth.apiKey);
router.use(CheckAuth.checkPremission("0000"));

router.post("/register", asyncHandler(AccessController.register));
router.post("/login", asyncHandler(AccessController.login));

//! AUTHENZICAION
router.use(asyncHandler(AuthUtils.authenzicationv3));

//! LOGOUT
router.post("/logout", asyncHandler(AccessController.logout));
router.post(
    "/handleRefreshToken",
    asyncHandler(AccessController.handleRefreshToken)
);

export default router;
