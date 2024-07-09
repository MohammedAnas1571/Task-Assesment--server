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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const adminModal_1 = require("./modal/adminModal");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoDB_js_1 = require("./db_connection/mongoDB.js");
dotenv_1.default.config();
(0, mongoDB_js_1.connectToDatabase)();
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = process.env.ADMINEMAIL;
        const password = process.env.ADMINPASSWORD;
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        yield adminModal_1.Admin.create({
            email: admin,
            password: hashedPassword,
        });
        console.log("Admin created successfully");
        process.exit();
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
seedAdmin();
