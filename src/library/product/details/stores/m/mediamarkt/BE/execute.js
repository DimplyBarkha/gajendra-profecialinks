
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'mediamarkt',
    domain: 'mediamarkt.be',
    loadedSelector: 'div#product-wrapper',
    noResultsXPath: null,
    zipcode: '',
  },
};
