
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'whiteaway',
    domain: 'whiteaway.com',
    // url: 'https://www.whiteaway.com/search_result/?keywords={searchTerms}#/sort_producent/',
    url: 'https://www.whiteaway.com/search_result/?keywords=Vaskemaskin#/',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
