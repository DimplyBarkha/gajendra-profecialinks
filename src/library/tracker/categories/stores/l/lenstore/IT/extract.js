module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'IT',
    domain: 'lenstore.it',
    store: 'lenstore',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productMenu }) => {
    await context.extract(productMenu);
  },
};
