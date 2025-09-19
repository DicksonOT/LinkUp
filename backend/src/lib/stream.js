import { StreamChat } from 'stream-chat';
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    throw new Error('Stream API key and secret must be set in environment variables');
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

const upsertStreamUser = async (userData) => {
    try {
     await streamClient.upsertUsers([userData]);
    return userData;  
    } catch (error) {
        console.error('Error creating/updating Stream user:', error);
    }
    
}
 const generateStreamToken = (userId) => {
    try {
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error('Error generating Stream token:', error);
    
    }
 }

export { upsertStreamUser, generateStreamToken };