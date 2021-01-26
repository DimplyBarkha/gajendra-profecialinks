
module.exports = {
  implements: 'product/listing/execute',
  parameterValues: {
    country: 'US',
    store: 'nordstrom',
    domain: 'nordstrom.com',
    loadedSelector: 'div#product-results-view',
    noResultsXPath: '//h2[contains(text(), "Looks like we don’t have exactly what you’re looking for.")]',
    gotoUrlTemplate: null,
    zipcode: '',
  },
};
