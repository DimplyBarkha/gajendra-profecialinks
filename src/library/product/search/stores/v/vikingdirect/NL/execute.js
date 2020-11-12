
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'vikingdirect',
    domain: 'vikingdirect.nl',
    url: 'https://www.vikingdirect.nl/nl/search/?text={searchTerms}',
    loadedSelector: 'ol[id="productList"]',
    noResultsXPath: 'div[id="searchEmpty"]',
    zipcode: '',
  },
};
