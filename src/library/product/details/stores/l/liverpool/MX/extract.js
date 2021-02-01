const { cleanUp } = require('../MX/shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'liverpool',
    transform: cleanUp,
    domain: 'liverpool.mx',
    zipcode: '',
  },
  implementation,
};
