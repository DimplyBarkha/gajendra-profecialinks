
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    domain: 'douglas.at',
    url: 'https://www.douglas.at/de/search?q={searchTerms}',
    loadedSelector: '.product-tile:last-child img',
    noResultsXPath: '//div[contains(@class,"search-page--empty")]',
    zipcode: '',
  },
};


