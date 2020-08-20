
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_deportes',
    domain: 'elcorteingles.es',
    loadedSelector: 'a.product_detail-brand',
    noResultsXPath: '//div[contains(@class,"artwork image")]',
  },
};
