
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'lenstore.co.uk',
    store: 'lenstore',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productMenu }) => {
    await context.extract(productMenu);
  },
};
