
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'ventePrivee',
    domain: 'veepee.es',
    url: 'https://www.veepee.es/ns/es-es/search/{searchTerms}',
    loadedSelector: 'div[@id^="product_"] img.linkImg',
    noResultsXPath: null,
    zipcode: '',
  },
};
