
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'arnotts',
    domain: 'arnotts.ie',
    url: 'https://www.arnotts.ie/search/?q={searchTerms}&lang=en_IE',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
