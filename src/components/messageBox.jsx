import { useEffect} from "react"

export default function Message({message,func,show,setShow}){

    useEffect(()=>{
        if(!func){
            const timeoutId=setTimeout(()=>{
            setShow(false)
            },5000)

            return () => clearTimeout(timeoutId);

        }
    },[])

    return(
        <>
        {show?
        <div className="messageBox">
            <h3>{message}</h3>
            {func?
            <>
            <button onClick={func}>Procceed</button>
            <button onClick={()=>setShow(false)}>Cancel</button>
            </>
            :null
            }
        </div>
        :null
        }
        </>
    )

}