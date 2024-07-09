import express, { Router } from "express";

import { signIn, addRole, getRoles, getRole, editRole, deleteRole, addUser, getUsers, getUser, editUser, signOut, deleteUser, forgetPassword } from "../controller/adminController";
import { imageMulter } from "../utils/multer";
import { verifyToken } from "../middleware/verifyToken";
const router: Router = express.Router();


router.post("/sign-in", signIn);
router.post("/forgot-password",forgetPassword)
router.get("/roles",verifyToken, getRoles);
router.get("/role/:roleId",verifyToken, getRole);
router.post("/role",verifyToken, addRole);
router.put("/role/:roleId",verifyToken,editRole)
router.get("/users",verifyToken,getUsers)
router.get("/user/:userId",verifyToken,getUser)
router.put("/user/:userId",verifyToken,imageMulter.single("image"),editUser)
router.post("/user",verifyToken,imageMulter.single("image"),addUser)
router.delete("/user/:userId",verifyToken,deleteUser)
router.delete("/role/:roleId",verifyToken,deleteRole)
router.get("/logout",verifyToken,signOut)


export default router;
