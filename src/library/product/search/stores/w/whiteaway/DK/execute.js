
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'whiteaway',
    domain: 'whiteaway.com',
    url: 'https://www.whiteaway.com/search_result/?keywords=bosch%20frysere#/sort_producent/',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
