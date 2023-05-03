import express from 'express';
import http from 'http';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log('Server running on http://locahol:8080');
});

const MONGO_URL = process.env.MONGO_URL!;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));
