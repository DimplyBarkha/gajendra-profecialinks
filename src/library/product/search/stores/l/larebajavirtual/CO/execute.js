
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CO',
    store: 'larebajavirtual',
    domain: 'larebajavirtual.com',
    url: 'https://www.larebajavirtual.com/catalogo/buscar/subMenuCategory/on/busqueda/{searchTerms}?ajax=id-productos-list&pageSize=150',
    loadedSelector: 'div[class="container-fluid"]>div>div[class="col-md-10 side"]',
    noResultsXPath: 'img[alt="lo sentimos no se han encontrado resultados"]',
    zipcode: '',
  },
};
