import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import Cookies from "js-cookie";

export default function Comments({ movieId }) {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [commentText,setCommentText]=useState("")
  const [parentId, setParentId] = useState(null);
  const [receiverName, setReceiverName] = useState("");

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/comments/${movieId}`);
      setComments(res.data);
    } catch (error) {
      setComments([]);
    }
  };

  const handleReplyClick = (commentId, username) => {
    if (!user) {
      alert("You need to be logged in to reply.");
      return;
    }
    setParentId(commentId);
    setReceiverName(username);
  };

  const submitComment = async () => {
    if (!replyText) return;
    if (!user) {
      alert("You need to be logged in to submit a comment.");
      return;
    }

    try {
      const token = Cookies.get("token");
      const data = {
        movieId,
        userId: user._id,
        text: replyText||commentText,
        parentId,
      };

      await axios.post(
        "http://localhost:5001/api/comments/add",
        data,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCommentText("")
      setReplyText("");
      setParentId(null);
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment or reply:", error);
    }
  };

  const renderReplies = (replies) => {
    return replies.map((reply) => (
      <div key={reply._id} style={{ marginLeft: "20px", padding: "5px", borderLeft: "2px solid #ddd" }}>
        <p>
          <strong>{reply.userId.username}:</strong> {reply.text}
        </p>
        <button onClick={() => handleReplyClick(reply._id, reply.userId.username)}>Reply</button>

        {reply.replies?.length > 0 && renderReplies(reply.replies)}
      </div>
    ));
  };

  return (
    <div>
      {comments.length > 0 ? (
        <>
          {comments.map((comment) => (
            <div key={comment._id} style={{ marginBottom: "10px", padding: "5px", border: "1px solid #ddd" }}>
              <p>
                <strong>{comment.userId.username}:</strong> {comment.text}
              </p>
              <button onClick={() => handleReplyClick(comment._id, comment.userId.username)}>
                Reply
              </button>

              {comment.replies?.length > 0 && renderReplies(comment.replies)}
            </div>
          ))}
        </>
      ) : (
        <p style={{ color: "orange" }}>No Comments Yet</p>
      )}

      {parentId && user && (
        <div>
          <h4>Replying to {receiverName}</h4>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button onClick={()=>{setParentId("");setReplyText("")}}>Cancel Reply</button>
          <button onClick={submitComment}>Submit Reply</button>
        </div>
      )}

      {user ? (
        <div>
          <h4>Comment</h4>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button onClick={submitComment}>Submit Comment</button>
        </div>
      ) : (
        <p style={{ color: "orange" }}>You need to be logged in to comment.</p>
      )}
    </div>
  );
}



