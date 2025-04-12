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

commentSchema.virtual('formattedTimestamp').get(function () {
  if (!this.timestamp) return '';
  const date = new Date(this.timestamp);
  const formattedDate = date.toISOString().split('T')[0];
  const formattedTime = date.toISOString().split('T')[1].substring(0, 5);
  return `${formattedDate} ${formattedTime}`;
});

commentSchema.set('toJSON', { virtuals: true });

const Comment = model("Comment", commentSchema);
export default Comment
