module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'PL',
    domain: 'mediamarkt.pl',
    store: 'mediamarkt',
    zipcode: '',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.extract(productMenu);
  },
};
