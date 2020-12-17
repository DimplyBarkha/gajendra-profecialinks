
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'carrefourRegular',
    domain: 'carrefour.es',
    url: 'https://www.carrefour.es/?q={searchTerms}',
    loadedSelector: "section[id='ebx-grid']",
    noResultsXPath: "//p[contains(@class,'ebx-no-results__message')]",
    zipcode: '',
  },
};
