
module.exports = {
  implementation: async ({ id }, { country, domain }, context, dependencies) => {
    return `https://www.booker.co.uk/catalog/productinformation.aspx?code=${id}`;
  },
  parameterValues: {
    domain: 'booker.co.uk',
    prefix: null,
    store: 'booker',
    country: 'UK',
  },
};
