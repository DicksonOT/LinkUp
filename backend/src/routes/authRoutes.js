import express from 'express';
import { login, 
        logout, 
        onBoard, 
        SignUp } from '../controllers/authControllers.js';
import { authUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', SignUp);
router.post('/login', login);
router.post('/logout',logout);

router.post('/onboarding', authUser, onBoard)

router.get('/me', authUser, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});
export default router;