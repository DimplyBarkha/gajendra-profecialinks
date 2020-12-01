
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DK',
    store: 'bilka',
    domain: 'bilka.dk',
    loadedSelector: 'div#product-view-details',
    noResultsXPath: '//div[@class="no-results"]',
    zipcode: '',
  },
};
