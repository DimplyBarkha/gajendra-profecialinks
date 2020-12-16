const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'loblaws',
    transform: cleanUp,
    domain: 'loblaws.ca',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(() => {
      if (!document.querySelector("div.product-name.product-name--product-details-page")) {
        throw new Error('Not a product Page');
      }
    });
    await context.extract(productDetails);
  },
};
