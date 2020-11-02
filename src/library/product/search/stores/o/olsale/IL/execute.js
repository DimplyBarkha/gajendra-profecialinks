
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'olsale',
    domain: 'olsale.co.il',
    url: 'https://www.olsale.co.il/Search.aspx?Search={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
