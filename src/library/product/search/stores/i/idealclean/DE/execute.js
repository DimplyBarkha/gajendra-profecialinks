
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'idealclean',
    domain: 'ideal_clean.de',
    url: 'https://www.idealclean.de/search?limit=20&search={searchTerms}',
    loadedSelector: 'div.LYSContainer_padding__1r8V2',
    noResultsXPath: null,
    zipcode: '',
  },
};
