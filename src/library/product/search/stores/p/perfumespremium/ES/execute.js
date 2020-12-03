
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'perfumespremium',
    domain: 'perfumespremium.es',
    url: 'https://www.perfumespremium.es/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.products-grid',
    noResultsXPath: '//div[@class="message notice"]/div[contains(text(), "La búsqueda no ha devuelto ningún resultado.")]',
    zipcode: '',
  },
};
