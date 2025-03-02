import { Link } from "react-router-dom";
export default function AuthForm({ type }) {
    return (
      <section className="authContainer container">
        <form className="authForm" action="" method="POST">
          <h2>{type}</h2>

          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" />
  
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" />
  
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
  
          {type === "Register" && (
            <>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" />
            </>
          )}
  
          <button className="registerBtn">{type}</button>
  
          {type === "Register" ? (
            <p>
              Already have an account? <Link to="/signup">Log in</Link>
            </p>
          ) : (
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          )}
        </form>
      </section>
    );
  }
  