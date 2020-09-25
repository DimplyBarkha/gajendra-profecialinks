const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const delay = t => new Promise(resolve => setTimeout(resolve, t));
  await delay(2000);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'n11',
    transform,
    domain: 'n11.com',
    zipcode: '',
  },
  implementation,
};
