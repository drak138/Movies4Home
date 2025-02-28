import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null); // Reference for detecting clicks outside

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

  return (
    <header>
      <Link className="logo" to="/Movies4Home/">
        Movies<span>4</span>Home
      </Link>

      <div className="search">
        <input type="text" placeholder="Enter movie name" />
        <a>
          <i className="fa-solid fa-magnifying-glass"></i>
        </a>
      </div>

      {/* Profile Section with ref */}
      <div className="profile" ref={profileRef}>
        <img className="profilePic" src="/public/guest.png" alt="" onClick={toggleProfileMenu} />

        <div className="downloadsLimit">
          <p className="downloadsLeft">3</p>
        </div>

        {/* Show/Hide Profile Menu */}
        <ul className={`profileAcord ${isProfileOpen ? "active" : ""}`}>
          <Link to="/profile" onClick={closeProfileMenu}>Profile</Link>
          <Link to="/library" onClick={closeProfileMenu}>Library</Link>
          <a href="" onClick={closeProfileMenu}>Logout</a>

          {/* Guest */}
          <Link to="/register" onClick={closeProfileMenu}>Register</Link>
          <Link to="/signup" onClick={closeProfileMenu}>Log in</Link>
        </ul>
      </div>
    </header>
  );
}

