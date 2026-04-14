import './src/config/env'; // 🔥 LOAD FIRST

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import apiRoutes from './src/routes/api';

import { MONGO_URI } from './src/config/env';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', apiRoutes);

app.get('/', (req, res) => {
  res.send('API running...');
});

async function start() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");

  app.listen(PORT, () => {
    console.log("Server running on", PORT);
  });
}

start();