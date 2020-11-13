async function implementation (inputs, parameters, dependencies, context) {
  const { productDetails } = dependencies;

  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'merqueo',
    transform: null,
    domain: 'merqueo.com',
    zipcode: '',
  },
  implementation,
};
