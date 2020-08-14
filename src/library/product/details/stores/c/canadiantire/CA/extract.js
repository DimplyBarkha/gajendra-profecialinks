const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'canadiantire',
    transform,
    domain: 'canadiantire.ca',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await context.waitForXPath('//div[@class="s7staticimage"]/img');
    await context.waitForXPath('//button[@class="pdp-image-carousel__item-video-thumbnail"]');
    await context.waitForSelector('span.js-chosen-store-city-name');
    return await context.extract(productDetails, { transform });
  },
};
