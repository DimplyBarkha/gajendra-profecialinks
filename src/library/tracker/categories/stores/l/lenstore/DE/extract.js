
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'lenstore.de',
    store: 'lenstore',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productMenu }) => {
    await context.extract(productMenu);
  },
};
