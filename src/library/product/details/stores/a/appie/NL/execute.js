
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'appie',
    domain: 'appie.nl',
    loadedSelector: '.product-footer__info',
    noResultsXPath: '//div[contains(@data-testhook,"search-no-results")]',
    zipcode: '',
  },
};
