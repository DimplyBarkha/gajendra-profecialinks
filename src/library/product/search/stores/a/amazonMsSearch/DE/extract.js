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
  return await context.extract(productDetails, { transform, type: 'APPEND' });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonMsSearch',
    transform,
    domain: 'amazon.de',
    zipcode: '',
  },
  implementation,
};
