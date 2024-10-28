import express from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  getUsernameById,
  updateUser,
  updateUserPrivilege,
  uploadProfilePicture,
  getUserProfilePic,
} from "../controller/user-controller.js";
import { verifyAccessToken, verifyIsAdmin, verifyIsOwnerOrAdmin } from "../middleware/basic-access-control.js";
import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

const router = express.Router();

router.get("/", verifyAccessToken, verifyIsAdmin, getAllUsers);

router.patch("/:id/privilege", verifyAccessToken, verifyIsAdmin, updateUserPrivilege);

router.post("/", createUser);

router.get("/username/:id", verifyAccessToken, getUsernameById);

router.get("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, getUser);

router.patch("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, updateUser);

router.delete("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, deleteUser);

// TODO: Don't put multer here
router.post("/upload", upload.single('image'), uploadProfilePicture)

router.post("/profilePic", upload.none(), getUserProfilePic)

export default router;
