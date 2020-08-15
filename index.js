// const puppeteer = require("puppeteer");

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto("https://medium.com/topic/javascript");
//   await page.screenshot({ path: "example.png" });

//   await browser.close();
// })();

const xml2js = require("xml2js");
const axios = require("axios");

async function pullMedium() {
  let mediumLink;
  const { data: xmlData } = await axios.get(
    "https://medium.com/feed/topic/javascript"
  );
  //   console.log(xmlData);
  return xml2js.parseStringPromise(xmlData /*, options */);
  // .then(function (result) {
  //   console.dir(result.rss.channel[0].item[0].link);
  //   console.log("Done");
  // })
  // .catch(function (err) {
  //   // Failed
  // });
  //   return mediumLink;
}

module.exports = pullMedium;
