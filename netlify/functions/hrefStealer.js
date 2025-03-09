import axios from 'axios';
import * as cheerio from 'cheerio';
import { setCorsHeaders } from './corsMiddleware.js';

export async function handler(event, context) {
    const { url } = event.queryStringParameters;
    if (!url) {
        return { 
            statusCode: 400, 
            body: JSON.stringify({ error: "Missing URL parameter" }), 
            headers: setCorsHeaders() 
        };
    }

    try {
        // Fetch the HTML from the URL
        console.log(`Fetching URL: ${url}`);
        const response = await axios.get(url);

        // Load the HTML into Cheerio
        const $ = cheerio.load(response.data);

        // Now, find the torrent link
        const modalTorrents = $('.modal-torrent');
        let torrentHref = null;

        modalTorrents.each((index, element) => {
            // Check if this modal contains the specific quality you're looking for
            if ($(element).find('#modal-quality-1080p').length > 0) {
                // Get the <a> tag inside the modal
                const link = $(element).find('a');
                if (link.length > 0) {
                    torrentHref = link.attr('href');
                    return false; // Exit loop once we find the link
                }
            }
        });

        // Return the result
        if (torrentHref) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, torrentLink: torrentHref }),
                headers: setCorsHeaders(),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ success: false, error: 'Torrent link not found' }),
                headers: setCorsHeaders(),
            };
        }
    } catch (error) {
        console.error('Error fetching URL:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
            headers: setCorsHeaders(),
        };
    }
}



