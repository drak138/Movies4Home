import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import hrefStealer from "./hrefStealer.js";
import dbConnect from "./connection.js";
import {registerUser,loginUser} from "./auth.js";
import verifyToken from "./middleware/auth.js";
import commentsRouter from "./routes/comments.js";


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
  

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
