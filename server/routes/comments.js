import express from "express";
import Comment from "../models/comments.js";
import verifyToken from "../middleware/auth.js";

const commentsRouter = express.Router();

commentsRouter.post("/add", verifyToken, async (req, res) => {
    try {
      const { movieId, text, parentId } = req.body;
      const userId = req.user.id;
  
      if (!text) return res.status(400).json({ error: "Comment text is required" });
  
      const newComment = new Comment({
        movieId,
        userId,
        text,
        parentId: parentId || null,
      });
  
      const savedComment = await newComment.save();
  
      if (parentId) {
        await Comment.findByIdAndUpdate(
          parentId,
          { $push: { replies: savedComment._id } }, 
          { new: true }
        );
      }
  
      res.status(201).json({ message: "Comment added successfully", comment: savedComment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  

  commentsRouter.get("/:movieId", async (req, res) => {
    try {
      const { movieId } = req.params;
  
      const comments = await Comment.find({ movieId, parentId: null })
        .populate("userId", "username")
        .populate({
          path: "replies",
          populate: { 
            path: "userId",
            select: "username"
          }
        })
        .sort({ timestamp: -1 });
      for (let comment of comments) {
        if (comment.replies && comment.replies.length > 0) {
          for (let reply of comment.replies) {
            await reply.populate({
              path: "replies",
              populate: { 
                path: "userId",
                select: "username"
              }
            });
          }
        }
      }
  
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Error fetching comments" });
    }
  });
  


export default commentsRouter
