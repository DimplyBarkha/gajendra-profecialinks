module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'BR',
    domain: 'submarino.com.br',
    store: 'submarino',
    zipcode: '',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.extract(productMenu);
  },
};
