
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'KE',
    store: 'naivas',
    domain: 'naivas.co.ke',
    url: 'https://www.naivas.co.ke/search?q={searchTerms}',
    loadedSelector: 'div.storeProducts.row',
    noResultsXPath: null,
    zipcode: '',
  },
};
