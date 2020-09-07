const { transform } = require('../format');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  
  return await context.extract(productDetails, {transform});
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'sprii',
    transform,
    domain: 'sprii.ae',
    zipcode: '',
  },
  implementation
};
