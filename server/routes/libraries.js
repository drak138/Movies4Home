import express from "express";
import Library from "../models/libraries.js";
import verifyToken from "../middleware/auth.js";

const libraryRouter = express.Router();

libraryRouter.post("/",verifyToken,async(req,res)=>{
    const {name}=req.body
    if(name.trim().length==0){
        return res.status(400).json({ message: "Library name requried"});
    }
    const userId=req.user._id
    try{
    const response=await createLibrary({userId,name})
    res.json({message:response})
    }catch(error){      
        res.status(400).json({ message: error.message || "Internal Server Error" });    }

})

export async function createLibrary({userId,type,name}){
    try{
        if(!userId){
            throw new Error("No user Id")
        }
        const libraryParams={userId}
        if(type){
            libraryParams.type=type
        }
        if(name){
            libraryParams.name=name
        }
        const newLibrary= new Library(libraryParams)
        await newLibrary.save();
        return "Successfuly created"
    }catch(error){
        throw new Error(error.message);
    }
}
libraryRouter.get("/",verifyToken,async(req,res)=>{
    const{userId,username}=req.query
    try{
        const ownedLibraries=await Library.find({userId})
        console.log(ownedLibraries)
        const memberLibraries=await Library.find({
            "members.username": username,
          })
          const allLibraries = [...ownedLibraries, ...memberLibraries];
        res.json(allLibraries)
    }catch(err){
        res.status(500).json(err)
    }
})

export default libraryRouter