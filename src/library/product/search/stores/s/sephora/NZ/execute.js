
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'sephora',
    domain: 'sephora.nz',
    url: 'https://www.sephora.nz/search?q={searchTerms}&view=60',
    loadedSelector: 'div.products-grid',
    // noResultsXPath: null,
    zipcode: '',
  },
};
