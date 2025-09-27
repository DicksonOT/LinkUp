import express from 'express';
import cors from 'cors';
import "dotenv/config";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import connectDB from './lib/mongoDB.js';
import cookieParser from 'cookie-parser';   
import path from 'path';

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();
const FRONTEND_DIST_PATH = path.join(__dirname, '../frontend/dist');

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

if (process.env.NODE_ENV === 'production') {
  console.log(`Serving static files from: ${FRONTEND_DIST_PATH}`);
  

  app.use(express.static(FRONTEND_DIST_PATH));
  

  app.get('*', (req, res) => { 
    res.sendFile(path.join(FRONTEND_DIST_PATH, 'index.html')); 
  });
}

connectDB()
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
