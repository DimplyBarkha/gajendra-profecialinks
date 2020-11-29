const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'telekarma',
    transform: transform,
    domain: 'telekarma.pl',
    zipcode: "''",
  },
  implementation,
};
