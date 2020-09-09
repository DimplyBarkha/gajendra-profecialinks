const { transform } = require('../../../../shared')
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.click('a[title="View all"]')
    await context.waitForMutuation('div.products', { timeout: 20000 })
  } catch (error) {
    
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NZ',
    store: 'smithandcaugheys',
    transform,
    domain: 'smithandcaugheys.co.nz',
    zipcode: '',
  },
  implementation,
};
