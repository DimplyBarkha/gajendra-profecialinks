const { transform } = require('../../../../shared');
const { createSearchUrl } = require('../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  await context.evaluate(createSearchUrl);
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_electronica',
    transform,
    domain: 'elcorteingles.es',
  },
  implementation,
};
