import * as process from 'process';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import { query } from '@/db';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 6969;

// will remove/change them later

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server!!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
