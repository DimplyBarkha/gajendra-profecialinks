
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'thebay',
    domain: 'thebay.com',
    url: 'https://www.thebay.com/search?q={searchTerms}',
    loadedSelector: 'div.row.product-grid',
    noResultsXPath: null,
    zipcode: '',
  },
};
