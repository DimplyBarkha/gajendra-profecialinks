module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    url: 'https://www.kroger.com/search?query={id}&searchType=natural&fulfillment=all',
    domain: 'kroger.com',
    prefix: null,
    suffix: null,
    country: 'US',
    store: 'kroger',
  },
};
