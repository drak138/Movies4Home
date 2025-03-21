import { Schema,model,Types } from "mongoose";

const commentSchema = new Schema({
  movieId: { 
  type: String,
  required: true 
  },
  userId: { 
  type: Types.ObjectId, 
  ref: "User", 
  required: true 
  },
  text: { 
  type: String, 
  required: true 
  },
  parentId: { 
  type: Types.ObjectId, 
  ref: "Comment", 
  default: null 
  }, 
  timestamp: { 
  type: Date, 
  default: Date.now
  },
  replies: [{
    type: Types.ObjectId,
    ref: "Comment",
  }],
});

commentSchema.pre('save', function(next) {
    if (this.timestamp) {
      const date = this.timestamp;
      const formattedDate = date.toISOString().split('T')[0];
      const formattedTime = date.toISOString().split('T')[1].substring(0, 5);
      this.timestamp = `${formattedDate} ${formattedTime}`;
    }
    next();
  });

const Comment = model("Comment", commentSchema);
export default Comment
