import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import hrefStealer from "./hrefStealer.js";
import dbConnect from "./connection.js";
import User from "./models/users.js";
import jwt from "jsonwebtoken"
import {registerUser,loginUser} from "./auth.js";


dotenv.config();

const app = express();
dbConnect()
// Middleware
app.use(cors());
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
app.get("/api/verifyToken", async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) return res.status(401).json({ message: "No token provided" });
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      console.log(decoded)

      const user = await User.findById(decoded.userId).select("-password");
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json({ user });
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  });
  

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
