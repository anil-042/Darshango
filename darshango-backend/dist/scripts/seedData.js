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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize Firebase Admin
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
            }),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
        console.log('Firebase Initialized');
    }
    catch (error) {
        console.error('Firebase Init Failed:', error);
        process.exit(1);
    }
}
const db = admin.firestore();
const clearCollection = (collectionPath) => __awaiter(void 0, void 0, void 0, function* () {
    const batch = db.batch();
    const snapshot = yield db.collection(collectionPath).get();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    yield batch.commit();
    console.log(`Cleared collection: ${collectionPath}`);
});
const seedData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Starting seed...');
        // Clear existing data
        yield clearCollection('projects');
        yield clearCollection('agencies');
        // 1. Seed Agencies
        const agencies = [
            { name: 'TechBuild Solutions', contact: 'contact@techbuild.com', phone: '9876543210', activeProjects: 2, performance: 95 },
            { name: 'Urban Infra Ltd', contact: 'info@urbaninfra.com', phone: '9876543211', activeProjects: 1, performance: 88 },
            { name: 'Rural Dev Corp', contact: 'support@ruraldev.com', phone: '9876543212', activeProjects: 1, performance: 92 }
        ];
        const agencyIds = [];
        for (const agency of agencies) {
            const docRef = yield db.collection('agencies').add(Object.assign(Object.assign({}, agency), { createdAt: new Date().toISOString(), lastUpdated: new Date().toISOString() }));
            agencyIds.push(docRef.id);
            console.log(`Created Agency: ${agency.name}`);
        }
        // 2. Seed Projects
        const projects = [
            {
                title: 'Adarsh Gram Road Construction',
                description: 'Construction of 5km road in Adarsh Gram village.',
                state: 'State A',
                district: 'District A',
                status: 'In Progress',
                estimatedCost: 5000000,
                progress: 25,
                startDate: '2025-01-15',
                endDate: '2025-06-30',
                implementingAgencyId: agencyIds[0],
                executingAgencyId: agencyIds[0],
                component: 'Adarsh Gram'
            },
            {
                title: 'Community Hall Renovation',
                description: 'Renovation of the existing community hall.',
                state: 'State B',
                district: 'District B',
                status: 'In Progress', // Changed from Planning to match enum options if needed, or keep Planning if valid
                estimatedCost: 2500000,
                progress: 0,
                startDate: '2025-03-01',
                endDate: '2025-05-30',
                implementingAgencyId: agencyIds[1],
                executingAgencyId: agencyIds[1],
                component: 'GIA'
            },
            {
                title: 'New Hostel Building',
                description: 'Construction of a new 50-bed hostel for students.',
                state: 'State A',
                district: 'District A',
                status: 'Completed',
                estimatedCost: 10000000,
                progress: 100,
                startDate: '2024-06-01',
                endDate: '2024-12-31',
                implementingAgencyId: agencyIds[0],
                executingAgencyId: agencyIds[0],
                component: 'Hostel'
            },
            {
                title: 'Solar Power Installation',
                description: 'Installation of solar panels in 10 villages.',
                state: 'State C',
                district: 'District C',
                status: 'In Progress',
                estimatedCost: 7500000,
                progress: 40,
                startDate: '2025-02-01',
                endDate: '2025-08-30',
                implementingAgencyId: agencyIds[2],
                executingAgencyId: agencyIds[2],
                component: 'Adarsh Gram'
            }
        ];
        for (const project of projects) {
            yield db.collection('projects').add(Object.assign(Object.assign({}, project), { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
            console.log(`Created Project: ${project.title}`);
        }
        console.log('Seeding completed successfully!');
    }
    catch (error) {
        console.error('Error seeding data:', error);
    }
});
seedData().then(() => process.exit(0));
