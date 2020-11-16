
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'martinservera',
    domain: 'martinservera.se',
    url: 'https://www.martinservera.se/sokresultat?SearchTerm={searchTerms}',
    loadedSelector: 'div[class="product-list row"]',
    noResultsXPath: '//p[@class="no-result-header"]',
    zipcode: '',
  },
};
