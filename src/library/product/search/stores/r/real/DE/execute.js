
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'real',
    domain: 'real.de',
    url: 'https://www.real.de/item/search/?search_value={searchTerms}&valueKey_search_value=',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
