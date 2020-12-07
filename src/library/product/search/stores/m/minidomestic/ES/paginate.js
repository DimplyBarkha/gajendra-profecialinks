
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'minidomestic',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.HotDealList',
    noResultsXPath: '//h3[contains(text(), "Página no encontrada")]',
    openSearchDefinition: null,
    domain: 'minidomestic.es',
    zipcode: '',
  },
};
