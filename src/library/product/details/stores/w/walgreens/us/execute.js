
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'us',
    store: 'walgreens',
    domain: 'walgreens.com',
    loadedSelector: 'div#product',
    noResultsXPath: '//h1[contains(@id, "zero-result-alert")]',
  },
};
