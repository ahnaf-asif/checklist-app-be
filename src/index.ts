import * as process from 'process';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import apiRouter from './api';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 6969;

app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server!!');
});

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
