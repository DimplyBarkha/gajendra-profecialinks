const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForXPath('//div[@class="bv-off-screen"]');
  } catch (error) {
    console.log('could not load ratings', error);
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'canadiantire',
    transform,
    domain: 'canadiantire.ca',
    zipcode: '',
  },
  implementation,
};
