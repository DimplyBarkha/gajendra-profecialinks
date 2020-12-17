
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'ES',
    domain: 'lyreco.com',
    store: 'lyreco',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productMenu }) => {
    await context.extract(productMenu);
  },
};
