
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    domain: 'groceries.morrisons.com',
    url: `https://groceries.morrisons.com/search?entry={searchTerms}`,
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
