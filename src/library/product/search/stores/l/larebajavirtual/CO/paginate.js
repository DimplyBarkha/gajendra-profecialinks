
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CO',
    store: 'larebajavirtual',
    // nextLinkSelector: '.next a',
    // nextLinkXpath: "//li[@class='next']/a",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#id-productos-list , .next a',
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.larebajavirtual.com/catalogo/buscar/ajax/id-productos-list/subMenuCategory/on/busqueda/{searchTerms}/codigoProducto_page/{page}?ajax=id-productos-list&pageSize=1000',
    },
    domain: 'larebajavirtual.com',
    zipcode: '',
  },
};
