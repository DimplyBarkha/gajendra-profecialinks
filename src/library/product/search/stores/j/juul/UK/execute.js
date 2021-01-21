module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'juul',
    domain: 'Juul.co.uk',
    url: 'https://www.juul.co.uk/shop#{searchTerms}',
    loadedSelector: 'div.product-listing',
    noResultsXPath: null,
    zipcode: '',
  },
};
