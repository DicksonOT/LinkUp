import toast from "react-hot-toast";
import axiosInstance from "./axios";

const signup = async (signupData) => {
    const { data } = await axiosInstance.post("/auth/signup", signupData);
    if (data.success) { toast.success(data.message) }
    return data;
}

const getAuthUser = async () => {
    try {
    const { data } = await axiosInstance.get("/auth/me");
    return data;
    } catch (error) {
        console.error("Error fetching auth user:", error);
        return null; 
    }
};

const completeOnboarding = async (formState) => {
    const { data } = await axiosInstance.post("/auth/onboarding", formState);
    return data;
}

const login = async (loginData) => {
    const { data } = await axiosInstance.post("/auth/login", loginData);
    return data;
}

const logout = async () => {
    const { data } = await axiosInstance.post("/auth/logout");
    return data;
} 

const getUserFriends = async () => {
  const { data } = await axiosInstance.get("/users/friends");
  return data.friends;
}

const getRecommendedUsers = async () => {
  const { data } = await axiosInstance.get("/users");
  return data.recommendedUsers;
}

const getOutgoingFriendReqs = async () => {
  const { data } = await axiosInstance.get("/users/outgoing-requests");
  return data;
}

const sendFriendRequest = async (userId) => {
  const { data } = await axiosInstance.post(`/users/send-request/${userId}`);
  return data;
}

const getFriendRequests = async () => {
  const { data } = await axiosInstance.get("/users/friend-requests");
  return data;
}

const acceptFriendRequest = async (requestId) => {
  const { data }= await axiosInstance.put(`/users/accept-request/${requestId}`);
  return data;
}

const getStreamToken= async () => {
  const { data }= await axiosInstance.get("/chat/token");
  return data;
}

export { signup, getAuthUser, completeOnboarding, login, logout, 
    getUserFriends, getRecommendedUsers, getOutgoingFriendReqs, sendFriendRequest, getFriendRequests, acceptFriendRequest, getStreamToken
 };