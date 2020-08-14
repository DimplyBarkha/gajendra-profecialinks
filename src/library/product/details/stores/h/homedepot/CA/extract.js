const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    transform,
    domain: 'homedepot.ca',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 5000))
      await context.click('a[class*="acl-link--weak order-1"]')
      await context.waitForSelector('div.hdca-fade-in-open')
      await new Promise(resolve => setTimeout(resolve, 5000))
      await context.click('div.hdca-store-list-item__ctas>button.acl-button--primary')
    } catch (e) {
      console.log(e)
    }
    await new Promise(resolve => setTimeout(resolve, 10000))
    return await context.extract(productDetails, { transform });
  },
};
