const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  try {
    await context.waitForSelector('#language-region-set', { timeout: 10000 });
    await context.click('#language-region-set');
  } catch (err) {
    console.log('Something happened while accepting the modal button.');
  }
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    transform,
    domain: 'costco.ca',
    zipcode: 'M5V 2A5',
  },
  implementation,
};
