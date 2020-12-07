
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'minidomestic',
    domain: 'minidomestic.es',
    url: 'https://www.minidomestic.com/epages/Minidomestic.sf/es_ES/?ViewAction=FacetedSearchProducts&SearchString={searchTerms}',
    loadedSelector: '.HotDealList',
    noResultsXPath: '//h3[contains(text(), "Página no encontrada")]',
    zipcode: '',
  },
};
