const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log("waiting for 10000")
  await new Promise((resolve, reject) => setTimeout(resolve, 90000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_perfumeria',
    transform,
    domain: 'elcorteingles.es',
    zipcode: '',
  },
};
