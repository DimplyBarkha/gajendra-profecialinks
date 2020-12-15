async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  const dataRef = await context.extract(productMenu);
  return dataRef;
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'IT',
    domain: 'mediaworld.it',
    store: 'mediaworld',
    zipcode: '',
  },
  implementation,
};
