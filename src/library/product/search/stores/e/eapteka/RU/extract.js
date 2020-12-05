const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  await new Promise((resolve, reject) => setTimeout(resolve, 5000));

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'eapteka',
    transform,
    domain: 'eapteka.ru',
    zipcode: "''",
  },
  implementation,
};
