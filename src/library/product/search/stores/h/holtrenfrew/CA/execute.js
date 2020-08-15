
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'holtrenfrew',
    domain: 'holtrenfrew.com',
    url: 'https://www.holtrenfrew.com/en/search/?text={searchTerms}',
    loadedSelector: 'div[class*="product__list"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
