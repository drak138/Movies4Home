import { createContext,useState,useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "./authContext";
export const DownloadContext = createContext();
export function DownloadCount({children}){
    const {user}=useContext(AuthContext)
    const [count, setCount] = useState(() => {
        const savedCount = localStorage.getItem("count") || (user ? 10 : 4);
        const lastReset = localStorage.getItem("lastReset") || 0;
        const today = new Date();
        const localDate = today.getFullYear() + "-" + 
                          String(today.getMonth() + 1).padStart(2, "0") + "-" + 
                          String(today.getDate()).padStart(2, "0");
        console.log(localDate)
        if (lastReset !== localDate) {
            const newCount = user ? 10 : 4;
            localStorage.setItem("count", newCount);
            localStorage.setItem("lastReset", localDate);
            localStorage.setItem("usedDownloads",0);
            return newCount;
        }

        return savedCount;
    });

    const [usedDownloads, setUsedDownloads] = useState(() => {
        return parseInt(localStorage.getItem("usedDownloads")) || 0;
    });

    useEffect(() => {
        localStorage.setItem("count", count);
        localStorage.setItem("usedDownloads", usedDownloads);
    }, [count, usedDownloads]);

    const downloadMovie = () => {
        setCount(prev => (prev > 0 ? prev - 1 : prev));
        setUsedDownloads(prev => (prev < 10 ? prev + 1 : prev));
    };

    useEffect(() => {
        if(user===null)return
        if (!user) {
            if (usedDownloads >= 4) {
                setCount(0);
                localStorage.setItem("count", 0);
            } else {
                console.log(count)
                setCount(4 - usedDownloads);
                localStorage.setItem("count", 4 - usedDownloads);
            }
        } else {
            const remainingDownloads = 10 - usedDownloads;
            setCount(remainingDownloads);
            localStorage.setItem("count", remainingDownloads);
        }
    }, [user]);

    return (
        <DownloadContext.Provider value={{ count, setCount, downloadMovie }}>
            {children}
        </DownloadContext.Provider>
    );
}