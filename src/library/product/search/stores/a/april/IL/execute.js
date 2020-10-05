
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'april',
    domain: 'april.co.il',
    url: 'https://www.april.co.il/AllResults?bskeyword={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};