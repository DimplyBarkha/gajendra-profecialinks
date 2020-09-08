
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NZ',
    store: 'davidjones',
    domain: 'davidjones.com',
    loadedSelector: 'div[class*="product product-top type-electrical"]',
    noResultsXPath: '//p[class*="lead"]',
    zipcode: '',
  },
};
