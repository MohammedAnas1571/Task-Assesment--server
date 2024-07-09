"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRole = exports.signIn = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const roleModel_1 = require("../modal/roleModel");
const adminModal_1 = require("../modal/adminModal");
const appError_1 = require("../utils/appError");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.signIn = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.appError("Please provide email and password", 400));
    }
    const admin = yield adminModal_1.Admin.findOne({ email });
    if (!admin) {
        return next(new appError_1.appError("Admin not found please check you email", 404));
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, admin.password);
    if (!isPasswordMatch) {
        return next(new appError_1.appError("Invalid password", 401));
    }
    const token = jsonwebtoken_1.default.sign({ id: admin._id }, process.env.TOKEN, {
        expiresIn: "5d",
    });
    res
        .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 5 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
    })
        .status(200)
        .json({ message: "Login successfully" });
}));
exports.addRole = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { rolename } = req.body;
    if (!rolename) {
        return next(new appError_1.appError("Please provide role", 400));
    }
    yield roleModel_1.Role.create({ rolename });
    res.status(200).json({ message: "Role added successfully" });
}));
