
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'GR',
    store: 'ab',
    domain: 'ab.gr',
    loadedSelector: 'div.ProductName-wrapper',
    noResultsXPath: '//div[contains(@class,"ErrorPage")]',
  },
};
