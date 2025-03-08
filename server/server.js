import hrefStealer from '../hrefStealer.js';  // Import the hrefStealer function

export default async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }
    
    try {
        const data = await hrefStealer(url); // Call hrefStealer function
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

