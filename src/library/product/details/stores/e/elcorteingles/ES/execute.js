
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    domain: 'elcorteingles.es',
    loadedSelector: '.pdp-title a',
    noResultsXPath: '//div[contains(@class,"artwork-toolbar ")]',
  },
};
