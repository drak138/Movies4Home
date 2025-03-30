import Library from "../models/libraries.js"

const verifyRole = async (req, res, next) => {
    const {action,libraryId,type}=req.body
    const user=req.user
    if (action == "add Movie") {
        if(!type){
        try {
            const { librariesId } = req.body;

            const libraries = await Promise.all(librariesId.map(libraryId => Library.findById(libraryId)));
    
            const allowedLibraries = libraries.filter(lib => {
                if (lib.userId.toString() === user._id.toString()) return true;
    
                const member = lib.members.find(member => member.username === user.username);
                return member && ["co-owner", "editor"].includes(member.role);
            });
    
            if (allowedLibraries.length === 0) {
                return res.status(403).json({ message: "You don't have permission to modify any of these libraries" });
            }

    
            req.allowedLibraries = allowedLibraries.map((lib)=>lib._id);
            return next();
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    }
    }else{
    try{
    const library=await Library.findById(libraryId)
    if (!library) return res.status(404).json({ message: "Library not found" });

    if(library.type=="liked")return res.status(404).json({ message: "This library can't be edited by anybody" });

    if(library.userId.toString()==user._id.toString()){
        next()
        return
    }

    const member=library.members.filter((member)=>member.username==user.username)
    if (!member) return res.status(404).json({ message: "Member doesn't exist" });


    const memberRole=member.role

    if(action=="rename"||action=="share"||action=="remove"){
        console.log(library.userId.toString()==user._id.toString())
        if(memberRole=="co-owner"||memberRole=="editor"){
            next();
        }
        else{
            return res.status(404).json({ message: "Member doesn't have the rights to make these changes" });
        }

    }
    if(action=="delete"||action=="remove Member"){
        if(memberRole=="co-owner"){
            next()
        }else{
            return res.status(404).json({ message: "Member doesn't have the rights to make these changes" });
        }
    }
    else{
        next()
    }
}catch(error){
    console.log(error)
}
    }
}
export default verifyRole