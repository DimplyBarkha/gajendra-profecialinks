
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    domain: 'douglas.at',    
    url: 'https://www.douglas.at/de/search?q={searchTerms}',
    loadedSelector: 'div.product-tile',
    noResultsXPath: '//h1[contains(@class,"error-404-component")]',
    zipcode: '',
  },
};
