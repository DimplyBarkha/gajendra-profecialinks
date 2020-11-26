
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'matthewclarklive',
    domain: 'matthewclarklive.com',
    url: "https://www.matthewclarklive.com/products/kw/{searchTerms}",
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
