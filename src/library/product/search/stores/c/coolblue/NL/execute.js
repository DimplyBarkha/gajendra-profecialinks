
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    domain: 'coolblue.nl',
    url: 'https://www.coolblue.nl/zoeken?query={}',
    loadedSelector: 'div#product-results',
    noResultsXPath: '//h1[contains(text(),"Geen resultaten voor")]',
    zipcode: '',
  },
};
