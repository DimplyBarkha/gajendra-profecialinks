
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    domain: 'coolblue.be',
    url: 'https://www.coolblue.nl/zoeken?query={searchTerms}',
    loadedSelector: 'div#product-results',
    noResultsXPath: '//h1[contains(text(),"Geen resultaten voor")]',
    zipcode: '',
  },
};
