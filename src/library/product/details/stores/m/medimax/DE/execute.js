
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'medimax',
    domain: 'medimax.de',
    loadedSelector: 'div#main-section',
    noResultsXPath: '//img[@alt="404-page"]',
    zipcode: '',
  },
};
