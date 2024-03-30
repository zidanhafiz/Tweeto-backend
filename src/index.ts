import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import { isAuthenticated } from './middlewares';

import authController from './controller/authentication';
import userController from './controller/user';
import postController from './controller/post';

dotenv.config();

const app = express();

// Middleware config
app.use(
  cors({
    credentials: true,
  })
);

app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json());

// Router
app.use('/auth', authController);
app.use('/users', isAuthenticated, userController);
app.use('/posts', isAuthenticated, postController);

export default app;
