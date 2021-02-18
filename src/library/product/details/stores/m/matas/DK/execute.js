
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DK',
    store: 'matas',
    domain: 'matas.dk',
    loadedSelector: 'h1.product-name.product-name--large',
    noResultsXPath: '//span[contains(., "Beklager! Ingen resultater")]',
    zipcode: '',
  },
};
