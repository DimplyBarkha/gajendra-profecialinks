
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    domain: 'flaconi.de',
    url: 'https://www.flaconi.de/search?q={searchTerms}&page=1',
    loadedSelector: 'div.canvas-menu-wrapper',
    noResultsXPath: null,
    zipcode: '',
  },
};
