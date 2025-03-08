import puppeteer from "puppeteer-extra";
import { setCorsHeaders } from "./corsMiddleware.js";

export async function handler(event, context) {
    let success=Boolean(true)
    const { url } = event.queryStringParameters;
    if (!url) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing URL parameter" }), headers: setCorsHeaders() };
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        const torrentHref = await page.evaluate(() => {
            const modalTorrents = Array.from(document.querySelectorAll('.modal-torrent'));
            for (const modalTorrent of modalTorrents) {
                if (modalTorrent.querySelector('#modal-quality-1080p')) {
                    const link = modalTorrent.querySelector('a');
                    if (link) {
                        return { success: true, href: link.href }; 

                    }
                }
            }
            return { success: false };

        });

        await browser.close();

        return {
            statusCode: 200,
            body: JSON.stringify({ success:torrentHref.success, torrentLink: torrentHref.href }), headers: setCorsHeaders()
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error}), headers: setCorsHeaders()
        };
    }
}

