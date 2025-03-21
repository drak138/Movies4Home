import axios from "axios";
import * as cheerio from "cheerio";

const hrefStealer = async (url) => {
  try {
    const response = await axios.get(url);
    const htmlEl = cheerio.load(response.data);

    const modalTorrents = htmlEl(".modal-torrent");
    let torrentHref = null;

    modalTorrents.each((index, element) => {
      if (htmlEl(element).find("#modal-quality-1080p").length > 0) {
        const link = htmlEl(element).find("a");
        if (link.length > 0) {
          torrentHref = link.attr("href");
          return false;
        }
      }
    });

    return torrentHref;
  } catch (error) {
    throw new Error("Error fetching or processing the URL.");
  }
};

export default hrefStealer;
