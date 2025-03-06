import express from "express";
import cors from "cors";
import hrefStealer from "./hrefStealer.js";

const app = express();
app.use(cors()); // Enable CORS for frontend requests
app.get("/",(req,res)=>{
    res.json("hello")
})

app.get("/hrefStealer", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Missing URL parameter" });
    const data=await hrefStealer(url)
    res.json(data)
});

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
