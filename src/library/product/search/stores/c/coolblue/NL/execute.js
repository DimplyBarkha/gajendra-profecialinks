
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    domain: 'coolblue.nl',
    url: 'https://www.coolblue.nl/zoeken?query={searchTerms}',
    loadedSelector: 'div[class*=product-grid__card] > div[class*=product-card]',
    noResultsXPath: '//h1[contains(text(),"Geen resultaten voor")]',
    zipcode: '',
  },
};
