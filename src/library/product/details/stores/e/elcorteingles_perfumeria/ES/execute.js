
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_perfumeria',
    domain: 'elcorteingles.es',
    loadedSelector: 'a.product_detail-brand',
    noResultsXPath: '//div[contains(@class,"artwork image")] | //p[contains(@class,"explain") and contains(text(),"no responde en este momento")]',
    zipcode: '',
  },
};
