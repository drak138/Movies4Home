import express from "express";
import Comment from "../models/comments.js";
import verifyToken from "../middleware/auth.js";

const corsOptions = {
  origin: ['http://localhost:5173', 'https://drak138.github.io'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
};

const commentsRouter = express.Router();
commentsRouter.use(corsOptions())

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
  
  

  async function populateReplies(comment) {
    await comment.populate({
      path: "replies",
      populate: { path: "userId", select: "username" }
    });
  
    for (let reply of comment.replies) {
      await populateReplies(reply);
    }
  }
  
  commentsRouter.get("/:movieId", async (req, res) => {
    try {
      const { movieId } = req.params;
  
      const comments = await Comment.find({ movieId, parentId: null })
        .populate("userId", "username")
        .sort({ timestamp: -1 });
  
      for (let comment of comments) {
        await populateReplies(comment);
      }
  
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Error fetching comments" });
    }
  });

  commentsRouter.put("/edit/:commentId",verifyToken,async(req,res)=>{
    try{
      const {commentId}=req.params
      const {text}=req.body
      const comment=await Comment.findById(commentId)
      if(!comment){
        return res.status(404).json({ error: "Comment not found" });
      }
      if (req.user._id.toString() != comment.userId.toString()){return}
      await Comment.findByIdAndUpdate(commentId,{text})
      res.json({ message: "Comment has been updated successfuly" })
    }
    catch(error){
      res.status(500).json({error:error})
    }
  })

  commentsRouter.delete("/delete/:commentId",verifyToken,async(req,res)=>{
    try {
      const { commentId } = req.params;
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      if (req.user._id.toString() !== comment.userId.toString()){return}

      const deleteCommentAndReplies = async (commentId) => {
        const comment = await Comment.findById(commentId);
        if (!comment) return;
      
        for (const replyId of comment.replies) {
          await deleteCommentAndReplies(replyId);
        }
      
        await Comment.findByIdAndDelete(commentId);
      };
  
      await deleteCommentAndReplies(commentId);
  
      res.json({ message: "Comment and all replies deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });
commentsRouter.get("/getUserComments/:userId",verifyToken,async(req,res)=>{
  const {userId}=req.params
  try{
    const commentCount=(await Comment.find()).filter((comment)=>{return comment.userId.toString()==userId.toString()})
    res.json({commentsCount:commentCount.length})
  }catch(error){
    res.json({error:error})
  }
})
  
  


export default commentsRouter
