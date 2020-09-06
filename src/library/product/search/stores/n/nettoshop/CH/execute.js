
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'nettoshop',
    domain: 'nettoshop.ch',
    url: 'https://www.nettoshop.ch/search?text={searchTerms}',
    loadedSelector: 'div .c-product-grid__item-wrapper',
    noResultsXPath: null,
    zipcode: '',
  },
};
