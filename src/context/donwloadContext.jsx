import { createContext,useState,useEffect } from "react";
export const DownloadContext = createContext();
export function DownloadCount({children,user}){
    const [count, setCount] = useState(() => {
        const savedCount = parseInt(localStorage.getItem("count")) || (user ? 10 : 4);
        const lastReset = parseInt(localStorage.getItem("lastReset")) || 0;
        const today = new Date().toISOString().split("T")[0];

        if (lastReset !== today) {
            const newCount = user ? 10 : 4;
            console.log(newCount)
            localStorage.setItem("count", newCount);
            localStorage.setItem("lastReset", today);
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
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        const lastReset = parseInt(localStorage.getItem("lastReset")) || 0;

        if (now - lastReset > fiveMinutes) {
            localStorage.setItem("lastReset", now);
            setUsedDownloads(0);
            setCount(user ? 10 : 4);
        } else {
            if (!user) {
                setCount(Math.max(4 - usedDownloads, 0));
            } else {
                setCount(10 - usedDownloads);
            }
        }
    }, [user]);

    return (
        <DownloadContext.Provider value={{ count, setCount, downloadMovie }}>
            {children}
        </DownloadContext.Provider>
    );
}