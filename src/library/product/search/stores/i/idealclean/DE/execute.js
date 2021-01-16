
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'idealclean',
    domain: 'ideal_clean.de',
    url: 'https://www2.idealclean.de/search?limit=150&search={searchTerms}',
    loadedSelector: 'div[class="LYSContainer_padding__1r8V2"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
