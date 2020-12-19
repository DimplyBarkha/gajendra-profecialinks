const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'expert',
    transform: transform,
    domain: 'expert.ie',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    SharedHelpers: 'module:product/details/stores/${store[0:1]}/${store}/helpersShared',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails, Helpers, SharedHelpers }) => {
    await context.evaluate(async function () {
      var elmnt = document.querySelector('div.page-wrapper, div.footer-main');
      elmnt.scrollIntoView();
    });

    const loadVideo = await context.evaluate(async function () {
      return !!document.querySelector('div.flix_mod_video');
    });

    try {
      await context.waitForSelector('div.fotorama-item', { timeout: 85000 });
    } catch (error) {
      console.log('No secondary images loading.');
    }

    if (loadVideo) {
      try {
        await context.waitForSelector('iframe[title*="Flix-media-video"]', { timeout: 75000 });
      } catch (error) {
        console.log('No videos loading.');
      }
    }
    await context.evaluate(() => {
      Array.from(document.querySelectorAll('#product_description div.value > ul > li')).forEach(elm => { elm.textContent = '|| ' + elm.textContent; });
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};
