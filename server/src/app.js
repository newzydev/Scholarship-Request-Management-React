import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());
if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/scholarship-requests', requestRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/staff', staffRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server listening on port ${env.port} (${env.nodeEnv})`);
});
