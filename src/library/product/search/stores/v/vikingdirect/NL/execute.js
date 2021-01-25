
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'vikingdirect',
    domain: 'vikingdirect.nl',
    url: 'https://www.vikingdirect.nl/nl/search/?text={searchTerms}',
    loadedSelector: 'body[id="odeuView"]',
    noResultsXPath: '//div[@id="searchEmpty"]',
    zipcode: '',
  },
};
