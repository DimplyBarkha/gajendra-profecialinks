async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'PE',
    domain: 'falabella.com.pe',
    store: 'falabella',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
