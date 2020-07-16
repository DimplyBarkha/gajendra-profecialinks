const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.waitForXPath('//div/@data-asin');
  return await context.extract(productDetails, { transform, type: 'APPEND'});
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'amazon',
    transform: transform,
    domain: 'amazon.ca',
  },
  implementation,
};
