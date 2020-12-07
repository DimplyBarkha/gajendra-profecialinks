
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    domain: 'coolblue.be',
    url: 'https://www.coolblue.be/nl/zoeken?query={searchTerms}',
    loadedSelector: 'div[class*=product-grid__card] > div[class*=product-card]',
    noResultsXPath: '//h1[contains(text(), "Geen resultaten voor")]',
    zipcode: '',
  },
};
