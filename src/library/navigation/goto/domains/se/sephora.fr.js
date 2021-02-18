
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'sephora.fr',
    timeout: 100000,
    country: 'FR',
    store: 'sephora',
    zipcode: '',
  },
  // implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
  // },
};
