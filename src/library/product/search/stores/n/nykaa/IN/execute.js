
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    domain: 'nykaa.com',
    url: "https://www.nykaa.com/search/result/?q={searchTerms}",
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
