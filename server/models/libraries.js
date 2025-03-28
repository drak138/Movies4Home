import { Schema,Types,model } from "mongoose";

const librarySchema=new Schema({
    name:{
        type:String,
        default:"Liked",
        required:true
    },
    userId:{
        type:Types.ObjectId,
        required:false
    },
    type: { 
    type: String, 
    enum: ["liked", "custom"], default: "custom" 
    },
    movies: [{ 
        id:{
            type:String
        },
        mediaType:{
            type:String,
            enum:["tv","movie"]
        }
    }],  
    members: [
        {
          username: { 
         type: String, 
         required: true 
        },
        role: { 
        type: String, 
        enum: ["co-owner", "editor", "viewer"],default:"viewer", 
        required: true 
        },
        },
      ],

})

const Library=model("Library",librarySchema)
export default Library