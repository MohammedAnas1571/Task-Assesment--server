"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
var mongoose_1 = require("mongoose");
var adminSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});
var adminModel = (0, mongoose_1.model)("Admin", adminSchema);
exports.Admin = adminModel;
