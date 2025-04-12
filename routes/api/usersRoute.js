import express from "express";
import { protect } from './../../middlewares/authMiddleware.js';
import {
    createUser,
    login,
    getUser,
    getAllUser,
    editUser
} from "../../controllers/userController.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", login);
router.get("/user", protect, getUser);
router.get("/getAll", protect, getAllUser);
router.put("/edit_account", protect, editUser);

export default router;
