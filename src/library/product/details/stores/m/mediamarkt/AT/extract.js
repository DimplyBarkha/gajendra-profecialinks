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
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    SharedHelpers: 'module:product/details/stores/${store[0:1]}/${store}/helpersShared',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails, Helpers, SharedHelpers }) => {
    const sharedhelpers = new SharedHelpers(context);

    await context.waitForFunction(function (sel) {
      return Boolean(document.querySelector(sel));
    }, { timeout: 15000 }, 'body');

    await sharedhelpers.autoScroll();
    try {
      await context.waitForSelector('div#flix-inpage', { timeout: 65000 });
      await context.waitForSelector('div[id^="flixinpage_"]', { timeout: 65000 });
      await context.waitForSelector('div#inpage-iframe-modal', { timeout: 65000 });
    } catch (error) {
      console.log('No manufacturer content');
    }

    await context.extract(productDetails, { transform: transformParam });
  },
};
