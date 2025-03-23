import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import hrefStealer from "./hrefStealer.js";
import dbConnect from "./connection.js";
import {registerUser,loginUser} from "./auth.js";
import verifyToken from "./middleware/auth.js";
import commentsRouter from "./routes/comments.js";
import User from "./models/users.js";
import bcrypt from "bcrypt"


dotenv.config();
const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
};

const app = express();
dbConnect()
// Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/hrefStealer", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ success: false, error: "Missing URL parameter" });
  }

  try {
    const torrentLink = await hrefStealer(url);
    
    if (torrentLink) {
      return res.json({ success: true, torrentLink });
    } else {
      return res.status(404).json({ success: false, error: "Torrent link not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
});
app.post("/api/auth/login",async(req,res)=>{
    const{username,email,password}=req.body
    try {
        const token = await loginUser({ username, email, password });
        res.status(200).json({token});
    } catch (error) {
        res.status(400).json({message: error.message });
    }
})
app.post("/api/auth/register",async(req,res)=>{
    const{username,email,password}=req.body
    try {
        const token = await registerUser({ username, email, password });
        res.status(201).json({token});
    } catch (error) {
        res.status(400).json({message: error.message });
    }
})
app.get("/api/verifyToken",verifyToken, async (req, res) => {
  const user = req.user;
  res.json({ message: "Token is valid", user });
  });
app.use("/api/comments",commentsRouter)
app.put("/api/profile/:userId",verifyToken,async(req,res)=>{
  const senderId=req.user._id
  const {userId}=req.params
  const {username,password,oldPass}=req.body
  if(userId!=senderId.toString()){
    return res.json({error:"Not owner"})
  }
  const user=await User.findById(userId)
  if(oldPass){
  const isPasswordCorrect = await bcrypt.compare(oldPass, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Old password is incorrect" });
  }
}
  try{
    const updates = {};

if (username) {
    updates.username = username;
}
if (password) {
    updates.password = await bcrypt.hash(password,10);
}
  await User.findByIdAndUpdate(userId,updates)
  res.json({message:"Changes made"})
  }catch(error){
    res.json({error:error})
  }
})
  

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
