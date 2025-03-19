import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
export default function AuthForm({ type }) {
  const {
    register,
    handleSubmit,
    resetField,
    setError,
    formState:{errors,isSubmitting}}
    =useForm()

    const navigate=useNavigate()
    const { setUser } = useContext(AuthContext);
    const submitAction=async(data)=>{
    console.log(data)
    
    if (data.confirmPassword?data.password !== data.confirmPassword:null) {
      resetField("confirmPassword")
      return setError("confirmPassword",{type:"validate",message:"Missmatch password"})
    }

  const {username,email,password}=data
   try{
    await axios.post(`http://localhost:5001/api/auth/${type=="Log in"?"login":"register"}`,{
      username,email,password
    }).then((res)=>{
      Cookies.set("token", res.data.token, { expires: 2 / 1440}); // Expires in 10 min

      setUser({ username });
       navigate("/")})
  }
  catch(error){
    console.log(error)
    const{input,message}=JSON.parse(error.response.data.message)
    return setError(input,{type:"validate",message})

  }

  }
  
    return (
      <section className="authContainer container">
        <form className="authForm" onSubmit={handleSubmit(submitAction)}>
          <h2 className="form-type">{type}</h2>

          <label htmlFor="username">Username</label>
          <div className="input-contianer">
          <input type="text" id="username" name="username"
          {...register("username",{
            required:"Username is required",
            minLength:{
              value:3,
              message:"Username is too short"
            }
          })} />
          {errors.username && <p className="error">{errors.username.message}</p>}
          </div>
  
          <label htmlFor="email">Email</label>
          <div className="input-contianer">
          <input type="text" id="email" name="email" {...register("email",{
            required:"Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email format",
            },
          })}/>
          {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
  
          <label htmlFor="password">Password</label>
          <div className="input-contianer">
          <input type="password" id="password" name="password"
          {...register("password",{
            required:"Password is required",
            minLength:{
              value:8,
              message:"Password is less than 8 characters"
            }
          })}/>
          {errors.password && <p className="error">{errors.password.message}</p>}
          </div>
  
          {type === "Register" && (
            <>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-contianer">
              <input type="password" id="confirmPassword" name="confirmPassword"
              {...register("confirmPassword",{
            required:"Field must be filled",
          })}
              />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
            </div>
            </>
          )}
  
          <button disabled={isSubmitting} className="registerBtn">{type}</button>
  
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
  