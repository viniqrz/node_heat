import express, { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import { router } from './routes';

const app = express();

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   res.json({ error: err.message });

//   next(err);
// });

app.use(cors());
app.use(express.json());
app.use(router);

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`User connected on ${socket.id}.`);
});

app.get('/github', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});

app.get('/signin/callback', (req, res) => {
  const { code } = req.query;

  return res.json({ code });
});

export { serverHttp, io };
