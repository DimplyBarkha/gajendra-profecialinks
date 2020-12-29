async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  const dataRef = await context.extract(productMenu);
  return dataRef;
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'US',
    domain: 'officedepot.com',
    store: 'officedepot',
    zipcode: '',
  },
  implementation,
};
