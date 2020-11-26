
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'myntraMweb',
    domain: 'myntra.com',
    url: 'https://www.myntra.com/{searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: '//center[@class="index-PageNotFoundContainer"]',
    zipcode: '',
  },
};
