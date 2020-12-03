const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    transform: cleanUp,
    domain: 'currys.co.uk',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { transform }, context, { productDetails }) => {
    async function extractVideos() {
      let videos;
      const productUrl = await context.evaluate(() => {
        return window.location.href;
      });
      const iframeUrl = await context.evaluate((iframeSelector) => {
        if (document.querySelector(iframeSelector)) { return document.querySelector(iframeSelector).getAttribute('src'); }
      }, '#isitetv-media-iframe');
      if (!iframeUrl) return;
      await context.goto(iframeUrl, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
      await context.waitForXPath('//a[contains(@class,"video_link")]');
      try {
        videos = await context.evaluate(async function () {
          const result = [];
          const videoElements = document.querySelectorAll('a[class*="video_link"]').length;
          console.log(videoElements + ' videos found');
          for (let i = 0; i < videoElements; i++) {
            // @ts-ignore
            await document.querySelectorAll('a[class*="video_link"]')[i].click();
            await new Promise(resolve => setTimeout(resolve, 3000));
            if (document.querySelector('video > source').getAttribute('src')) {
              result.push('https:' + document.querySelector('video > source').getAttribute('src'));
            }
          }
          return result;
        });
      } catch (e) {
        console.log(e);
        console.log('Error extracting videos.');
      }
      await context.goto(productUrl, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
      return videos;
    };

    try {
      console.log('Wait for cookies popup');
      await context.waitForSelector('#onetrust-accept-btn-handler', { timeout: 5000 });
      console.log('Accept cookies');
      await context.click('#onetrust-accept-btn-handler');
    } catch (e) {
      console.log('No cookies popup');
    }

    const videos = await extractVideos();

    await context.evaluate(async ({ videos }) => {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      function appendData(data) {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const name = `product-${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
          addElementToDocument(name, data[key]);
        }
      }
      const data = {};
      const productDigitalData = JSON.parse(document.querySelector('script[id="app.digitalData"]').textContent).product[0];
      data.availability = productDigitalData.stockStatus || '';
      data.url = window.location.href;
      if (videos && videos.length) data.videos = videos;
      appendData(data);
    }, { videos });
    await context.extract(productDetails, { transform });
  },
};