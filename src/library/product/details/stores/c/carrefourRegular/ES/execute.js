
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'carrefourRegular',
    domain: 'carrefour.es',
    loadedSelector: 'div[class*="product-pics__container"] img',
    noResultsXPath: "//section[contains(@class,'ebx-no-results ebx-empathy-x__no-results') and contains(.,'No se han encontrado resultados para')]",
    zipcode: '',
  },
};
