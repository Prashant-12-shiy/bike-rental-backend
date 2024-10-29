import express from "express";
import {getUser, updateUser} from "../controller/UserController";

const router = express.Router();

router.post("/get-user", getUser);
router.post("/update-user", updateUser);

export default router;