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
  const [editText, setEditText] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

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
    if (!replyText&&!commentText) return;
    if (!user) {
      alert("You need to be logged in to submit a comment.");
      return;
    }
    try {
      console.log(commentText)
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


  const toggleMenu = (commentId) => {
    setMenuOpen(menuOpen === commentId ? null : commentId);
  };

  const startEditing = (commentId, text) => {
    setEditCommentId(commentId);
    setEditText(text);
    setMenuOpen(null); // Close menu
  };

  const submitEdit = async (commentId) => {
    try {
      const token = Cookies.get("token");
      await axios.put(
        `http://localhost:5001/api/comments/edit/${commentId}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditCommentId(null);
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const cancelEdit = () => {
    setEditCommentId(null);
  };

  const renderReplies = (replies) => {
    return replies.map((reply) => (
      <div key={reply._id} style={{ position: "relative", marginLeft: "20px", padding: "5px 0px 5px 5px", borderLeft: "2px solid #ddd" }}>
        <div className="reply">
          {editCommentId==reply._id
          ? (
            <div>
              <input className="commentEditInput" value={editText} onChange={(e) => setEditText(e.target.value)} />
              <button onClick={() => submitEdit(reply._id)}>Save Edit</button>
              <button onClick={cancelEdit}>Cancel</button>
            </div>
          ):<div className="commentWrapper"><span className="commentator">{reply.userId.username}: </span>
          <p> {reply.text}</p></div>
          }
          {user&& user._id==reply.userId._id&& (
                          <div style={{position:"relative"}}>
                          <button onClick={() => toggleMenu(reply._id)}>...</button>
                          {menuOpen === reply._id && (
                            <div style={{ background: "orange", border: "1px solid #ccc", position: "absolute", right:"-5px" }}>
                              <button onClick={() => startEditing(reply._id, reply.text)}>Edit</button>
                              <button onClick={() => deleteComment(reply._id)}>Delete</button>
                            </div>
                          )}
                        </div>
          )}
        </div>
        <button onClick={() => handleReplyClick(reply._id, reply.userId.username)}>Reply</button>

        {reply.replies?.length > 0 && renderReplies(reply.replies)}
      </div>
    ));
  };

  return (
    <div style={{marginTop:"20px"}}>
      {comments.length > 0 ? (
        <div className="commentsContianer">
          {comments.map((comment) => (
            <div key={comment._id} style={{ marginBottom: "10px", padding: "5px", border: "1px solid #ddd" }}>
              <div className="comment">
                {editCommentId == comment._id ? (
              <div>
                <input className="commentEditInput" value={editText} onChange={(e) => setEditText(e.target.value)} />
                <button onClick={() => submitEdit(comment._id)}>Save Edit</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ):
            <div className="commentWrapper">
            <span className="commentator">{comment.userId.username}: </span>
              <p>{comment.text}</p>
              </div>
              }
              {user && user._id == comment.userId._id && (
              <div style={{position:"relative"}}>
                <button onClick={() => toggleMenu(comment._id)}>...</button>
                {menuOpen === comment._id && (
                  <div style={{ background: "orange", border: "1px solid #ccc", position: "absolute",right:"-5px" }}>
                    <button onClick={() => startEditing(comment._id, comment.text)}>Edit</button>
                    <button onClick={() => deleteComment(comment._id)}>Delete</button>
                  </div>
                )}
              </div>
            )}
              </div>
              <button onClick={() => handleReplyClick(comment._id, comment.userId.username)}>Reply</button>
              {comment.replies?.length > 0 && renderReplies(comment.replies)}
            </div>
          ))}
        </div>
      ) : (
        <p style={{justifySelf:"center",margin:"20px 0px", color: "orange" }}>No Comments Yet</p>
      )}

      {parentId && user && (
        <div className="replyForm">
          <h4>Replying to {receiverName}</h4>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div>
          <button className="cancelReplyBtn" onClick={()=>{setParentId("");setReplyText("")}}>Cancel Reply</button>
          <button className="submitReplyBtn" onClick={submitComment}>Submit Reply</button>
          </div>
        </div>
      )}

      {user && !parentId && (
        <div className="commentForm">
          <h4>Comment</h4>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className="submitCommentBtn" onClick={submitComment}>Submit Comment</button>
        </div>
      )}
      {!user&&(
        <p style={{justifySelf:"center", color: "orange" }}>You need to be logged in to comment.</p>
      )}
    </div>
  );
}



