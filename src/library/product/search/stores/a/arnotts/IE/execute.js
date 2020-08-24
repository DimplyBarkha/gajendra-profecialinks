
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'arnotts',
    domain: 'arnotts.ie',
    url: 'https://www.arnotts.ie/search/?q={searchTerms}&lang=en_IE&start=0&sz=48&productsearch=true',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
