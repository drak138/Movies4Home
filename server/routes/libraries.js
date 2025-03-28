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
        const memberLibraries=await Library.find({
            "members.username": username,
          })
          const allLibraries = [...ownedLibraries, ...memberLibraries];
        res.json(allLibraries)
    }catch(err){
        res.status(500).json(err)
    }
})
libraryRouter.put("/",verifyToken,async(req,res)=>{
    const {name,libraryId}=req.body
    try{
        await Library.findByIdAndUpdate(libraryId,{name})
        res.json({message:"Renamed successfuly"})
    }catch(error){
        res.status(500).json({message:error})
    }
})
libraryRouter.delete("/",verifyToken,async(req,res)=>{
    const {libraryId}=req.body
    try{
        await Library.findByIdAndDelete(libraryId)
        res.json({message:"Deleted Successfuly"})
    }catch(error){
        res.status(500).json({message:error})
    }
})
libraryRouter.put("/add",verifyToken,async(req,res)=>{
    const {type,movieId,librariesId,mediaType}=req.body

    try{
        if(!type){
        await Library.updateMany({_id:{$in:librariesId}},{$push: { movies: {id: movieId, mediaType: mediaType } } })
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
libraryRouter.put("/remove",verifyToken,async(req,res)=>{
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

export default libraryRouter