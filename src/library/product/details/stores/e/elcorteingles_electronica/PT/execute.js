
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PT',
    store: 'elcorteingles_electronica',
    domain: 'elcorteingles.es',
    loadedSelector: 'a.product_detail-brand',
    noResultsXPath: '//div[contains(@class,"artwork image")]',
    zipcode: '',
  },
};
