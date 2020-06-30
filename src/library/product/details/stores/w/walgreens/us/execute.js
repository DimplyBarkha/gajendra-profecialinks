
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'us',
    store: 'walgreens',
    domain: 'walgreens.com',
    loadedSelector: 'div#product, div.wag-row__center',
    noResultsXPath: '//h1[contains(@id, "zero-result-alert")]',
  },
};
