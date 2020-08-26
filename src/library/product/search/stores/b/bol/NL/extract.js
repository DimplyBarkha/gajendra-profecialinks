
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    transform: null,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation
};

// const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {

  });
  return await context.extract(productDetails, { transform });
}