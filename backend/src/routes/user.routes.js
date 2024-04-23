import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
  updateAccountDetails,
  loginUserWithToken,
  sendActivationEmail,
  checkActivationEmail,
  searchUser,
  getUserWithId,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/login-with-token").post(verifyJWT, loginUserWithToken);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

// Email Actions

router.route("/send-activation-email").post(verifyJWT, sendActivationEmail);

router
  .route("/activation-account/:email/:activationToken")
  .get(checkActivationEmail);

router.route("/search/:query").get(verifyJWT, searchUser);

router.route("/get-user-with-id/:userId").get(verifyJWT, getUserWithId);

export default router;
