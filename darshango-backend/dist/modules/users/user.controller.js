"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const userService = __importStar(require("./user.service"));
const response_1 = require("../../utils/response");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = req.query;
        const users = yield userService.getAllUsers(filters);
        (0, response_1.successResponse)(res, users, 'Users fetched successfully');
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message, 500);
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService.getUserById(req.params.id);
        if (!user)
            return (0, response_1.errorResponse)(res, 'User not found', 404);
        (0, response_1.successResponse)(res, user);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.getUser = getUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService.createUser(req.body);
        (0, response_1.successResponse)(res, user, 'User created successfully');
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService.updateUser(req.params.id, req.body);
        (0, response_1.successResponse)(res, user);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`[UserController] Deleting user with ID: ${req.params.id}`);
        yield userService.deleteUser(req.params.id);
        (0, response_1.successResponse)(res, null, 'User deleted successfully');
    }
    catch (error) {
        console.error(`[UserController] Failed to delete user: ${error.message}`);
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.deleteUser = deleteUser;
