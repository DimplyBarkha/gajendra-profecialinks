
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'alcampo',
    nextLinkSelector: ('//li[contains(., "Siguiente Página")]')[2],
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.caja.caja-reposo.productGridItem ',
    noResultsXPath: '//div[@class="page-not-found-content"]',
    openSearchDefinition: null,
    domain: 'alcampo.es',
    zipcode: '',
  },
};
