"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const mongoose_1 = require("mongoose");
const roleSchema = new mongoose_1.Schema({
    rolename: {
        type: String,
        required: true,
    },
    isBlock: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const RoleModel = (0, mongoose_1.model)("Role", roleSchema);
exports.Role = RoleModel;
