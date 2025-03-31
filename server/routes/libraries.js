import express from "express";
import Library from "../models/libraries.js";
import jwt from "jsonwebtoken"
import verifyToken from "../middleware/auth.js";
import verifyRole from "../middleware/role.js";


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
        const memberLibraries=await Library.find({
            "members.username": username,
          })
          const allLibraries = [...ownedLibraries, ...memberLibraries];
        res.json(allLibraries)
    }catch(err){
        res.status(500).json(err)
    }
})
libraryRouter.put("/",verifyToken,verifyRole,async(req,res)=>{
    const {name,libraryId}=req.body
    try{
        await Library.findByIdAndUpdate(libraryId,{name})
        res.json({message:"Renamed successfuly"})
    }catch(error){
        res.status(500).json({message:error})
    }
})
libraryRouter.delete("/",verifyToken,verifyRole,async(req,res)=>{
    const {libraryId}=req.body
    try{
        await Library.findByIdAndDelete(libraryId)
        res.json({message:"Deleted Successfuly"})
    }catch(error){
        res.status(500).json({message:error})
    }
})
libraryRouter.put("/add",verifyToken,verifyRole,async(req,res)=>{
    const {type,movieId,mediaType}=req.body

    try{
        if(!type){
        const allowedLibraries=req.allowedLibraries
        await Library.updateMany({_id:{$in:allowedLibraries}},{$push: { movies: {id: movieId, mediaType: mediaType } } })
        res.json("added successfuly")
        }
        else {
            const userId = req.user._id;
            const library = await Library.findOne({ userId, type });
            if (library) {
                const movieExists = library.movies.some(
                    (movie) => movie.id === movieId && movie.mediaType === mediaType
                );
                const update = movieExists
                    ? { $pull: { movies: { id: movieId, mediaType: mediaType } } }
                    : { $push: { movies: {id: movieId, mediaType: mediaType } } };
        
                await Library.findOneAndUpdate({ userId, type }, update);
                res.json("Added/removed successfully");
            }
        }
    }catch(error){
        res.status(500).json(error)
    }
})
libraryRouter.put("/remove",verifyToken,verifyRole,async(req,res)=>{
    const{savedId,libraryId}=req.body
    try{
        const library=await Library.findById(libraryId)
        if(library){
            const savedExists=library.movies.some((movie)=>movie.id==savedId)
            if(savedExists){
                await Library.findByIdAndUpdate(libraryId,{$pull:{ movies:{id:savedId}}});
                res.json("Deleted successfully");
            }
        }
    }catch(error){
        res.status(500).json(error)
    }
})
libraryRouter.post("/invite",verifyToken,verifyRole,async(req,res)=>{
    const {libraryId,userId}=req.body
    const token = jwt.sign({libraryId},process.env.JWT_SECRET,{ expiresIn: "1h"})

    const longUrl = `https://drak138.github.io/Movies4Home/#/library/invite/${token}`;
    const response=await axios.get(`https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`)
    const inviteLink=response.data.shorturl;
    console.log(inviteLink)
    res.json(inviteLink)
})
libraryRouter.put("/invite",verifyToken,async(req,res)=>{
    const{inviteToken,user}=req.body
    try{
    const decode=jwt.verify(inviteToken,process.env.JWT_SECRET)
    const library=await Library.findById(decode.libraryId)

    if(library){
        const isOwner=library.userId==user._id
        if(isOwner){
            throw new Error("You can't join your own library"); 
        }
        const alreadyIn=library.members.some((member)=>member.username==user.username)
        if(alreadyIn){
            throw new Error("You are already a Member")
        }
        await Library.findByIdAndUpdate(decode.libraryId,{$push:{members:{username:user.username}}})
        res.json("Added to library succesfuly")
    }
    }
    catch(error){
        if(error.message=="jwt expires"){
            res.status(400).json("Link has expired")
        }
        if(error.message){
            res.status(400).json(error.message)
        }
    }

})
libraryRouter.put("/leave",verifyToken,verifyRole,async(req,res)=>{
    const {user,memberId,libraryId}=req.body
    try{

        const library=await Library.findById(libraryId)
        if(!library){
            throw new Error("Library not found")
        }
        if(memberId){
            await Library.findByIdAndUpdate(libraryId,{$pull:{members:{_id:memberId}}})
            res.json("Member removed")
        }
        else{
            if(library.userId.toString()==user._id.toString()){
            await Library.findByIdAndUpdate(libraryId,{userId:""})
            res.json("Left successfuly")
            }
            await Library.findByIdAndUpdate(libraryId,{$pull:{members:{username:user.username}}})
            res.json("Member removed") 
        }

    }catch(error){

        if(error.message){
            res.status(400).json(error.message)
        }

        res.status(500).json(error)
    }
})
libraryRouter.put("/changeRole",verifyToken,verifyRole,async(req,res)=>{
    const {role,libraryId,memberId}=req.body
    try{
        const library=await Library.findById(libraryId)
        if(!library){throw new Error("Library not found")}
        await Library.findByIdAndUpdate(libraryId,{ $set:{ "members.$[elem].role": role } },{ arrayFilters: [{ "elem._id": memberId }], new: true });        
        res.json("Role Updated")
    }
    catch(error){
        if(error.message){
            res.status(400).json({message:error.message})
        }
        res.status(500).json(error)
    }
})

export default libraryRouter