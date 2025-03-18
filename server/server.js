import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import hrefStealer from "./hrefStealer.js";  // Import hrefStealer function

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define the /api/hrefStealer route in server.js
app.get("/api/hrefStealer", async (req, res) => {
  const { url } = req.query;  // Get URL parameter from query string
  if (!url) {
    return res.status(400).json({ success: false, error: "Missing URL parameter" });
  }

  try {
    // Call the hrefStealer function to get the torrent link
    const torrentLink = await hrefStealer(url);
    
    if (torrentLink) {
      return res.json({ success: true, torrentLink });
    } else {
      return res.status(404).json({ success: false, error: "Torrent link not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

// Set the port
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
