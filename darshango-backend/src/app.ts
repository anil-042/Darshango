import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', routes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root Route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'DarshanGo Backend API is running',
        version: '1.0.0',
        docs: '/api/v1/docs' // Placeholder
    });
});

// Error Handler
app.use(errorHandler);

export default app;
