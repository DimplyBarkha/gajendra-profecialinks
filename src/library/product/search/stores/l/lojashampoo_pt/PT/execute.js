
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PT',
    store: 'lojashampoo_pt',
    domain: 'lojashampoo.pt',
    url: 'https://www.lojashampoo.pt/index.php?route=product/search&search={searchTerms}&limit=100',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
