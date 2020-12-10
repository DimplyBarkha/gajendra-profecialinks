module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    url: 'https://www.kroger.com/p/upc/{id}',
    domain: 'kroger.com',
    prefix: null,
    suffix: null,
    country: 'US',
    store: 'kroger',
  },
};
