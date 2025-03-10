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
        console.log(`Fetching URL: ${url}`);
        const response = await axios.get(url);

        const htmlEl = cheerio.load(response.data);

        const modalTorrents = htmlEl('.modal-torrent');
        let torrentHref = null;

        modalTorrents.each((index, element) => {
            if (htmlEl(element).find('#modal-quality-1080p').length > 0) {
                const link = htmlEl(element).find('a');
                if (link.length > 0) {
                    torrentHref = link.attr('href');
                    return false;
                }
            }
        });

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



