import puppeteer from "puppeteer-extra";
export default async function hrefStealer (url){
    try {
        const browser = await puppeteer.launch({ 
            headless: true,    
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        const torrentHref = await page.evaluate(() => {
            const modalTorrent = Array.from(document.querySelectorAll('.modal-torrent')).find(modal =>
                modal.querySelector('#modal-quality-1080p')
            );
            return modalTorrent ? modalTorrent.querySelector('a')?.href : null;
        });

        await browser.close();

        if (torrentHref) {
            return({ success: true, torrentLink: torrentHref });
        } else {
            return({ success: false, message: "No 1080p torrent link found" });
        }
    } catch (error) {
        return({ error: error.message });
    }
}
