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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.auth = exports.db = void 0;
const admin = __importStar(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize Firebase Admin SDK
// In production, use a service account JSON file or environment variables
// For this setup, we'll use environment variables
let db;
let auth;
let storage;
try {
    if (!admin.apps.length) {
        // Check if critical env vars are present to avoid "Failed to parse private key" immediately if empty
        if (!process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY === "your-private-key") {
            throw new Error('Missing or default FIREBASE_PRIVATE_KEY in .env');
        }
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle private key newlines for different environments
                privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
            }),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
        console.log('Firebase Admin Initialized');
    }
    exports.db = db = admin.firestore();
    exports.auth = auth = admin.auth();
    exports.storage = storage = admin.storage();
}
catch (error) {
    console.error('Firebase Admin Initialization Failed:', error);
    console.warn('⚠️  Server starting without Firebase connection. Database operations will fail until valid credentials are provided in .env.');
    // Mock objects to prevent crash on import, but throw on usage
    const mockThrow = () => { throw new Error('Firebase not initialized. Please check your .env file and provide valid Firebase credentials.'); };
    // Cast to any to bypass strict typing for the mock
    exports.db = db = {
        collection: () => ({
            doc: () => ({ get: mockThrow, set: mockThrow, update: mockThrow, delete: mockThrow }),
            add: mockThrow,
            where: () => ({ get: mockThrow }),
            get: mockThrow
        })
    };
    exports.auth = auth = {
        getUser: mockThrow,
        getUserByEmail: mockThrow,
        createUser: mockThrow,
        updateUser: mockThrow,
        deleteUser: mockThrow,
        verifyIdToken: mockThrow
    };
    exports.storage = storage = {
        bucket: () => ({ file: () => ({ save: mockThrow, delete: mockThrow, getSignedUrl: mockThrow }) })
    };
}
