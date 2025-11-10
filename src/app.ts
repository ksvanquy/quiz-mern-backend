import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import apiRoutes from './routes'; // chỉ import 1 file duy nhất

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Prefix /api cho tất cả routes
app.use('/api', apiRoutes);

export default app;
