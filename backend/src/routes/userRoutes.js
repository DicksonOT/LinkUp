import express from 'express';
import { authUser } from '../middleware/authMiddleware.js';
import { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingRequests } from '../controllers/userController.js';


const router = express.Router();

router.use(authUser)
router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);

router.post('/send-request/:id', sendFriendRequest)
router.put('/accept-request/:id', acceptFriendRequest)

router.get('/friend-requests', getFriendRequests);
router.get('/outgoing-requests', getOutgoingRequests);

export default router;