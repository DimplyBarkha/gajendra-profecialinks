const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'HU',
    store: 'emag',
    transform: transform,
    domain: 'emag.hu',
    zipcode: '',
  },
  implementation,
};
