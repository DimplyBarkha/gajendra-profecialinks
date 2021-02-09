
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CO',
    store: 'larebajavirtual',
    nextLinkSelector: 'li[class="next"]>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="container-fluid"]>div>div[class="col-md-10 side"]',
    noResultsXPath: 'img[alt="lo sentimos no se han encontrado resultados"]',
    // openSearchDefinition: {
    //   template: 'https://www.larebajavirtual.com/catalogo/buscar/ajax/id-productos-list/subMenuCategory/on/busqueda/{searchTerms}/codigoProducto_page/{page}?ajax=id-productos-list&pageSize=150',
    // },
    domain: 'larebajavirtual.com',
    zipcode: '',
  },
};
