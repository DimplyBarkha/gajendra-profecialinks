module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_papeleria',
    domain: 'elcorteingles.es',
    url: 'https://www.elcorteingles.es/papeleria/search/?s={searchTerms}',
    loadedSelector: 'li.products_list-item',
    noResultsXPath: '//div[@class="products_list-container _no_products vp"] | //html[not(//div[@id="products-list"]/ul/li)]',
    zipcode: '',
  },
};
