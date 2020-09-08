
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DK',
    store: 'bilka',
    domain: 'bilka.dk',
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="no-results"]',
    zipcode: '',
  },
};
