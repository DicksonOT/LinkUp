import User from "../models/user.js";
import FriendRequest from "../models/friendRequest.js";

const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },              // exclude me
                { _id: { $nin: currentUser.friends } },       // exclude my friends
                { isOnboarded: true }                         // only onboarded users
            ]
        });

        res.status(200).json({ success: true, recommendedUsers })
    } catch (error) {
        console.error('Error fetching recommended users:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('friends')
            .populate('friends', 'username learningLang nativeLang profilePic');

        res.status(200).json({ success: true, friends: user.friends });
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: recipientId } = req.params;

        if (myId === recipientId) {
            return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
        }

        const recipient = await User.findById(recipientId);
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: 'You are already friends with this user' });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'A friend request already exists between you and this user' });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json({ success: true, message: 'Friend request sent', friendRequest });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const acceptFriendRequest = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }
        if (friendRequest.recipient.toString() !== myId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to accept this friend request' });
        }

        if (friendRequest.status === 'accepted') {
            return res.status(400).json({ message: 'This friend request has already been accepted' });
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        })

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        })

        res.status(200).json({ success: true, message: 'Friend request accepted', friendRequest });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ message: 'Server error' });
    }

}

const getFriendRequests = async (req, res) => {
    try {
        const myId = req.user._id;

        const incomingReqs = await FriendRequest.find({
            recipient: myId,
            status: 'pending'
        }).populate('sender', 'username learningLang nativeLang profilePic');     
        
        const acceptedRequests = await FriendRequest.find({
            sender: myId,
            status: 'accepted'
        }).populate('recipient', 'username profilePic');
        res.status(200).json({ success: true, acceptedRequests, incomingReqs });

    } catch (error) {
        console.error('Error fetching friend requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getOutgoingRequests = async (req, res) => {
    const myId = req.user._id;
    try {
        const outgoingReqs = await FriendRequest.find({
            sender: myId,
            status: 'pending'
        }).populate('recipient', 'username nativeLang learningLang profilePic');

        res.status(200).json({ success: true, outgoingReqs });
    } catch (error) {
        console.error('Error fetching outgoing friend requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingRequests };