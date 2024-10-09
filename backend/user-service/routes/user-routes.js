import express from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  updateUserPrivilege,
  uploadProfilePicture,
  getUserProfilePic,
} from "../controller/user-controller.js";
import { verifyAccessToken, verifyIsAdmin, verifyIsOwnerOrAdmin, uploadSingleImage, uploadNone } from "../middleware/basic-access-control.js";

const router = express.Router();

router.get("/", verifyAccessToken, verifyIsAdmin, getAllUsers);

router.patch("/:id/privilege", verifyAccessToken, verifyIsAdmin, updateUserPrivilege);

router.post("/", createUser);

router.get("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, getUser);

router.patch("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, updateUser);

router.delete("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, deleteUser);

router.post("/upload", uploadSingleImage, uploadProfilePicture)

router.get("/profilePic/:imageName", uploadNone, getUserProfilePic)

export default router;
