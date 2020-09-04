
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    domain: 'coolblue.nl',
    url: 'https://www.coolblue.nl/zoeken?query={searchTerms}',
    loadedSelector: 'div#product-results',
    noResultsXPath: '//h1[contains(text(),"Geen resultaten voor")] | //h1[contains(text(),"Alles over Dyson producten")]',
    zipcode: '',
  },
};
