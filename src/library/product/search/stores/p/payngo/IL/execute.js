
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'payngo',
    domain: 'payngo.co.il',
    url: 'https://www.payngo.co.il/instantsearchplus/result?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
