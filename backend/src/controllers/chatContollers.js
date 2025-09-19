import { generateStreamToken } from "../lib/stream.js";

const getStreamToken =  async (req, res) => {
  try {
    const token = generateStreamToken(req.user.id);

    res.status(200).json({ success:true, token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export { getStreamToken };