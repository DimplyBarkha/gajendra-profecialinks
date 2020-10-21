
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    domain: 'costco.ca',
    url: 'https://www.costco.ca/CatalogSearch?dept=All&keyword={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
