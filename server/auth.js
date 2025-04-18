import User from "./models/users.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { createLibrary } from "./routes/libraries.js";

async function checkIfTaken(checkData,symbol){
    const existing=await User.findOne(checkData)
    if(!symbol.symbol){
    if (existing) {
        const field = Object.keys(checkData)[0];
        const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1); // Capitalize first letter
        throw new Error(JSON.stringify({ input: field, message: `${capitalizedField} already taken` }));
    }
    }
    else{
    if (!existing) {
        const field = Object.keys(checkData)[0];
        const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1); // Capitalize first letter
        throw new Error(JSON.stringify({ input: field, message: `${capitalizedField} doesn't exist` }));
    }
    }
  
}
export async function registerUser({username,email,password}){
    await checkIfTaken({username},{symbol:null})
    await checkIfTaken({email},{symbol:null})
    const newUser = new User({ username, email, password});
    await newUser.save();
    const token=createToken(newUser)
    await createLibrary({userId:newUser._id,type:"liked"})
    return token
}
export async function loginUser({username,email,password}){
    await checkIfTaken({username},{symbol:"!"})
    await checkIfTaken({email},{symbol:"!"})
    const user = await User.findOne({ email });
    if(user.username!==username){
        throw new Error(JSON.stringify({ input: "username", message: `Username and email don't match` }));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error(JSON.stringify({ input: "password", message: `Incorrect password` }));
    }
    const token=createToken(user)
    return token
}
function createToken(user){
    const payload={
         email:user.email,
         _id: user._id, 
         username: user.username 
    }
    const token = jwt.sign(payload,process.env.JWT_SECRET,{ expiresIn: "24d"});
      return token
}