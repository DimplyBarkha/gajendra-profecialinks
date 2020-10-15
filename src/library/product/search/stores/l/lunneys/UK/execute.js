
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'lunneys',
    domain: 'lunneys.uk',
    url: 'https://lunneys.uk/catalogsearch/result/?q=%27{searchTerms}%27',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
