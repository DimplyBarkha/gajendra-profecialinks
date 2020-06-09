
module.exports = {
  implementation: async ({ id }, { country, domain }, context, dependencies) => {
    return `https://groceries.morrisons.com/products/${id}`;
  },
  parameterValues: {
    domain: 'groceries.morrisons.com',
    prefix: null,
    country: 'UK',
    store: 'morrisons',
  },
};
