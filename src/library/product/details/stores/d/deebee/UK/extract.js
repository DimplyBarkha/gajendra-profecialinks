const { transform } = require('./transform');
async function implementation(inputs,
  parameters,
  context,
  dependencies) {

  const { productDetails } = dependencies;
  const { transform } = parameters;
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'deebee',
    transform,
    domain: 'deebee.co.uk',
    zipcode: '',
  },
};
