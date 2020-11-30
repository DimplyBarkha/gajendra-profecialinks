
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'rewe',
    domain: 'shop.rewe.de',
    loadedSelector: null,
    noResultsXPath: '//span[contains(@class,"search-service-rsZeroResultsSearchTerm")]',
    zipcode: '',
  },
};
