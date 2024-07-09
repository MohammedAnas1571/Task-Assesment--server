import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Role } from "../modal/roleModel";
import { Admin } from "../modal/adminModal";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { User } from "../modal/userModel";

export const signIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return next(new AppError("Admin not found please check you email", 404));
    }
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return next(new AppError("Invalid password", 401));
    }
    const token = jwt.sign({ id: admin._id }, process.env.TOKEN as string, {
      expiresIn: "5d",
     
    });
 
    res
    .cookie("access_token", token, {
      httpOnly: true,
      maxAge: 5 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production'
    })
    .status(200)
    .json({ message: "Login successfully" });
  }
);

export const addRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rolename } = req.body;
    if (!rolename) {
      return next(new AppError("Please provide role", 400));
    }
    const uniqueRolename = rolename.toLowerCase();
    const existingRole = await Role.findOne({ rolename: uniqueRolename });

    if (existingRole) {
      return next(new AppError("This Rolename is already exist", 409));
    }
    await Role.create({ rolename: uniqueRolename });

    res.status(201).json({ success: true, message: "Role added successfully" });
  }
);

export const getRoles = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const roles = await Role.find();
    res.status(200).json({ success: true, data: roles });
  }
);

export const getRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { roleId } = req.params;
    if (!roleId) {
      return next(new AppError("Please provide role id", 400));
    }
    const role = await Role.findById(roleId);
    if (!role) {
      return next(new AppError("Role not found", 404));
    }
    res.status(200).json({ success: true, data: role });
  }
);

export const editRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { roleId } = req.params;
    const { rolename, isBlock } = req.body;
    if (!roleId) {
      return next(new AppError("Please provide role id", 400));
    }
    if (!rolename || !isBlock) {
      return next(new AppError("Please provide details", 400));
    }
    const role = await Role.findByIdAndUpdate(roleId, {
      $set: { rolename, isBlock },
    });
    if (!role) {
      return next(new AppError("Role not found", 404));
    }
    res.status(200).json({ success: true, message: "Successfully updated" });
  }
);

export const deleteRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { roleId } = req.params;
    if (!roleId) {
      return next(new AppError("Please provide role id", 400));
    }
    const role = await Role.findByIdAndDelete(roleId);
    if (!role) {
      return next(new AppError("Role not found", 404));
    }
    res.status(200).json({ success: true, message: "Successfully deleted" });
  }
);

export const addUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, mobile, role } = req.body;
    const imgUrl = req.file?.path;

    console.log(imgUrl);

    if (!name || !email || !mobile || !role || !imgUrl) {
      return next(
        new AppError(
          "Please provide all required details (name, email, mobile, role, image).",
          400
        )
      );
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email is already in use", 400));
    }

    await User.create({ name, email, mobile, role, profilePhoto: imgUrl });

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  }
);

export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find().populate("role", "rolename");
    res.status(200).json({ success: true, data: users });
  }
);

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    if (!userId) {
      return next(new AppError("Please provide User id", 400));
    }
    const user = await User.findById(userId).populate("role", "rolename _id");
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({ success: true, data: user });
  }
);

export const editUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { name, email, mobile, role,isBlock} = req.body;
    const imgUrl = req.file?.path;


    if (!name || !email || !mobile || !role  || !isBlock) {
      return next(
        new AppError(
          "Please provide all required details (name, email, mobile, role,image).",
          400
        )
      );
    }
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser._id.toString() !== userId) {
      return next(new AppError("Email is already in use", 400));
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (imgUrl && user.profilePhoto) {
      const existingPhotoPath = path.resolve(user.profilePhoto);
      fs.unlink(existingPhotoPath, (err) => {
        if (err) {
          console.error("Error deleting the file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });
    }
    user.name = name;
    user.email = email;
    user.mobile = mobile;
    user.role = role;
    user.isBlock= isBlock
    if (imgUrl) {
      user.profilePhoto = imgUrl;
    }

    await user.save();

    res.status(200).json({ success: true, message: "User updated successfully" });
  }
);

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    if (!userId) {
      return next(new AppError("Please provide role id", 400));
    }
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return next(new AppError("Role not found", 404));
    }
    res.status(200).json({ success: true, message: "Successfully deleted" });
  }
);


export const signOut = catchAsync(async (req, res, next) => {
  res.clearCookie("access_token", {
    httpOnly: true,
  });
  res.status(200).json({ message: "Cookies cleared, signed out successfully" });
});