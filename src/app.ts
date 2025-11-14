import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import apiRoutes from './routes'; // chỉ import 1 file duy nhất
import { swaggerUi, swaggerSpec } from './swagger';
import { apiResponseMiddleware } from './utils/apiResponse';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Attach API envelope helpers + requestId
app.use(apiResponseMiddleware());

// Prefix /api cho tất cả routes
app.use('/api', apiRoutes);

// Swagger UI (docs)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
