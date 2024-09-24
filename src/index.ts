import * as process from 'process';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import apiRouter from './api';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 6969;

// will remove/change them later

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server!!');
});

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
