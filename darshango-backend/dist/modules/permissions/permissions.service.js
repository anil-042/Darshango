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
exports.updatePermissions = exports.getPermissions = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const DATA_FILE = path_1.default.join(__dirname, '../../data/permissions.json');
const getPermissions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield promises_1.default.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        // If file doesn't exist, return empty object or default
        return {};
    }
});
exports.getPermissions = getPermissions;
const updatePermissions = (permissions) => __awaiter(void 0, void 0, void 0, function* () {
    yield promises_1.default.writeFile(DATA_FILE, JSON.stringify(permissions, null, 2));
    return permissions;
});
exports.updatePermissions = updatePermissions;
