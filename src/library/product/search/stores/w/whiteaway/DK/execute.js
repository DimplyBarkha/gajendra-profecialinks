
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'whiteaway',
    domain: 'whiteaway.com',
    url: 'https://www.whiteaway.com/search_result/?keywords={searchTerms}#/sort_producent/',
    // url: 'https://www.whiteaway.com/search_result/?keywords=vaskemaskine%209%20kg#/sort_producent/',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};

