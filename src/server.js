import path from 'node:path';
import express from "express";
import cookieParser from 'cookie-parser';
import { env } from "./utils/env.js";
import "dotenv/config";
import pino from "pino-http";
import cors from "cors";
// import contactsRouter from "./routers/contacts.js";
import router from './routers/index.js';


import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const PORT = process.env.PORT || 3000;

export const setupServer = () => {
  const app = express();

  app.use('/avatars', express.static(path.resolve('src', 'public/avatars')));

  app.use(cors());
  app.use(
  express.json({
    type: ['application/json', 'application/vnd.api+json'],
    limit: '100kb',
  }),
);

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  // app.use('/contacts', contactsRouter);
  app.use(cookieParser());
  app.use(router);
  app.use('*', notFoundHandler);
  app.use(errorHandler);


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Time: ${new Date().toLocaleString()}`);
  });
};

