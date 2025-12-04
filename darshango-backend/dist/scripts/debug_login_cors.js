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
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:5001/api/v1';
const debugLogin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Attempting login with CORS headers...');
        const res = yield axios_1.default.post(`${API_URL}/auth/login`, {
            email: 'admin@darshango.com',
            password: 'admin123'
        }, {
            headers: {
                'Origin': 'http://localhost:3000', // Simulate frontend origin
                'Content-Type': 'application/json'
            }
        });
        console.log('Login Successful!');
        console.log('Status:', res.status);
        console.log('Token:', res.data.token ? 'Received' : 'Missing');
    }
    catch (error) {
        console.error('Login Failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
        else {
            console.error('Error:', error.message);
        }
    }
});
debugLogin();
