
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'thewhiskyexchange',
    domain: 'thewhiskyexchange.com',
    loadedSelector: 'article[class="product-page"]',
    noResultsXPath: '//img[contains(@alt, "not found")]',
    zipcode: '',
  },
};
