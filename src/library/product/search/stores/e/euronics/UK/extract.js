
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  return context.extract(productDetails, { transform });

}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'euronics',
    transform: null,
    domain: 'euronics.co.uk',
  },
  implementation,
};
