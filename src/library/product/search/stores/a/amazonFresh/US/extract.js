const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.waitForXPath('//div[@class="tile__product-slide-rating-wrapper"]/e2-rating/@reviews-number');
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    transform: transform,
    domain: 'amazon.com',
  },
  implementation,
};
