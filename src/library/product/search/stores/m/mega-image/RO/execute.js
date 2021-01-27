
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RO',
    store: 'mega-image',
    domain: 'mega-image.ro',
    url: 'https://www.mega-image.ro/search?q={searchTerms}',
    loadedSelector: 'ul.search-results-container,[data-testid="cookie-popup-accept"]',
    noResultsXPath: '//span[text()="Nu am gasit"]',
    zipcode: '',
  },
};
