const { transform } = require('../../../../transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails, Helpers: { Helpers } } = dependencies;

  await context.waitForXPath('//div/@data-asin');
  const helpers = new Helpers(context);
  helpers.addURLtoDocument('added-searchurl');
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    transform,
    domain: 'amazon.com',
  },
  dependencies: {
    productDetails: 'extraction:product/search/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
  },
  implementation,
};
