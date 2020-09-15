const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.at',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 15000));
    // await context.waitForSelector('div#wrp_loadbee div#content_loadbee div.loadbee-page');
    // await context.waitForSelector('div#wrp_flixmedia div.wrapper_flixmedia div.flix-inpage');

    // const manufacturerInfo = await context.evaluate(function () {
    //   return !!document.querySelector('button#more_flixmedia');
    // });

    async function autoScroll () {
      await context.evaluate(async function () {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    }
    // if (manufacturerInfo) {
    autoScroll();
    try {
      await context.waitForSelector('div#flix-inpage', { timeout: 65000 });
      await context.waitForSelector('div[id^="flixinpage_"]', { timeout: 65000 });
      await context.waitForSelector('div#inpage-iframe-modal', { timeout: 65000 });
    } catch (error) {
      console.log('No manufacturer content');
    }
    // }

    await context.extract(productDetails, { transform: transformParam });
  },
};
