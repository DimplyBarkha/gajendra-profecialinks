async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'CL',
    domain: 'paris.cl',
    store: 'paris',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
