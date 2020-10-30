
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'meijer',
    domain: 'meijer.com',
    url: 'https://www.meijer.com/shop/en/search/?text={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
