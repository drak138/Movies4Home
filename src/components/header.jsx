import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { DownloadContext } from "../context/donwloadContext";

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null); // Reference for detecting clicks outside
  const [query,setQuery]=useState("")
  const navigate= useNavigate()
  const {user,logout}=useContext(AuthContext)
  const {count}=useContext(DownloadContext)
  

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const closeProfileMenu = () => {
    setIsProfileOpen(false);
  };
  // Close menu if clicking outside of profile div
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        closeProfileMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit=(e)=>{
    e.preventDefault();
    if (query) {
      navigate(`/search/${query}/1`);
    }
  }
  const logoutHanlder=(e)=>{
  closeProfileMenu(e)
  logout()
  }

  return (
    <header>
      <Link className="logo" to="/">
        Movies<span>4</span>Home
      </Link>

      <form onSubmit={handleSubmit} className="search">
        <input type="text" placeholder="Enter movie name"
        value={query}
        onChange={(e)=>{setQuery(e.target.value)}}
        />
        <button type="submit">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>

      {/* Profile Section with ref */}
      <div className="profile" ref={profileRef}>
        <img className="profilePic" src="/Movies4Home/guest.png" alt="" onClick={toggleProfileMenu} />

        <div className="downloadsLimit">
          <p className="downloadsLeft">{count}</p>
        </div>

        {/* Show/Hide Profile Menu */}
        <ul className={`profileAcord ${isProfileOpen ? "active" : ""}`}>
          {user?
          <>
          <Link to="/profile" onClick={closeProfileMenu}>Profile</Link>
          <Link to="/library" onClick={closeProfileMenu}>Library</Link>
          <button onClick={logoutHanlder}>Logout</button>
          </>:
          <>
          <Link to="/register" onClick={closeProfileMenu}>Register</Link>
          <Link to="/signup" onClick={closeProfileMenu}>Log in</Link>
          </>
          }
        </ul>
      </div>
    </header>
  );
}

