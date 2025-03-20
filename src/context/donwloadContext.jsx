import { createContext,useState,useEffect } from "react";
export const DownloadContext = createContext();
export function DownloadCount({children,user}){
    const [count, setCount] = useState(() => {
        console.log(user)
        return localStorage.getItem("count") || (user?10:4);
      });
      const [usedDownloads, setUsedDownloads] = useState(() => {
        return parseInt(localStorage.getItem("usedDownloads")) || 0;
      });
    useEffect(()=>{
        localStorage.setItem("count",count)
        localStorage.setItem("usedDownloads", usedDownloads);
    },[count,usedDownloads])
    const downloadMovie = () => {
        setCount(prev => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        });
        setUsedDownloads(prev => {
            if (prev < 10) {
              return prev + 1;
            }
            return prev;
          });
      };
      useEffect(()=>{
        if (!user) {
            if (usedDownloads >= 4) {
              setCount(0);
              localStorage.setItem("count", 0);
            }
            else if(usedDownloads<4){
                setCount(4-usedDownloads)
                localStorage.setItem("count",count)
            }
          }
          if (user) {
            const remainingDownloads = 10 - usedDownloads;
            setCount(remainingDownloads);
            localStorage.setItem("count", remainingDownloads);
          }
      },[user])

    return(
<DownloadContext.Provider value={{count,setCount,downloadMovie}}>
{children}
</DownloadContext.Provider>
    )
}