import { Link } from "react-router-dom"
export default function header() {
    return(
        <header>
            
        <Link className="logo" to="/">Movies<span>4</span>Home</Link>
        <div className="search">
        <input type="text" placeholder="Enter movie name"/>
        <a><i className="fa-solid fa-magnifying-glass"></i></a>
        </div>

        <div className="profile">
            <img className="profilePic" src="/guest.png" alt=""/>
            <div className="downloadsLimit">
                <p className="downloadsLeft">
                    3
                </p>
            </div>
            <ul className="profileAcord">
                {/* User */}
                <a href="">Profile</a>
                <Link to="/library">Library</Link>
                <a href="">Logout</a>
                {/* Guest */}
                <a href="">Register</a>
                <a href="">Login</a>
            </ul>
        </div>

    </header>
    )
}