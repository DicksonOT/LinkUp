import express from 'express';
import { authUser } from '../middleware/authMiddleware.js';
import { getStreamToken } from '../controllers/chatContollers.js';

const router = express.Router();
router.get('/token', authUser, getStreamToken);


export default router;