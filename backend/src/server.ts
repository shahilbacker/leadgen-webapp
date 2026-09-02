import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB } from './config/db';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Enable CORS for frontend client
app.use(
  cors({
    origin: [FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware (Development)
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[HTTP ${req.method}] ${req.url} - ${timestamp}`);
  next();
});

// API Root & Healthcheck Endpoints
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      api: 'operational',
    },
  });
});

app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'Lead Generation REST API',
    version: '1.0.0',
    documentation: {
      auth: {
        login: 'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh',
        me: 'GET /api/auth/me (Bearer Token required)',
      },
      leads: {
        submit: 'POST /api/leads',
        list: 'GET /api/leads (Bearer Token required, Admin or Viewer)',
        delete: 'DELETE /api/leads/:id (Bearer Token required, Admin only)',
      },
    },
    demoAccounts: [
      { role: 'admin', email: 'admin@example.com', password: 'AdminPass123!' },
      { role: 'viewer', email: 'viewer@example.com', password: 'ViewerPass123!' },
    ],
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// 404 Not Found Middleware
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Centralized Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
  });
});

// Server Initialization
const startServer = async () => {
  // Connect to MongoDB asynchronously
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`
=====================================================
🚀 LeadGen Backend API Server Running!
📡 Port:           http://localhost:${PORT}
📚 API Directory:  http://localhost:${PORT}/api
🩺 Healthcheck:    http://localhost:${PORT}/health
=====================================================
    `);
  });
};

startServer().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
  process.exit(1);
});

export default app;
