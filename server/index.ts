import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import utils from './utils';

import backgroundRoutes from "./routes/backgrounds";

function logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
	console.error(err.stack)
	next(err)
}

const app: Express = express();

// Security middlewares
app.use(helmet());
// Enable all CORS requests 
app.use(cors());
// Populate request body
app.use(express.json());
// Log errors
app.use(logErrors)
// Serve static files from the "public" directory
console.log(path.join(__dirname, '../public'))
app.use(express.static(path.join(__dirname, utils.generateFilePathForEnv('public'))))

// API routes
app.use("/", backgroundRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});