module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_papeleria',
    domain: 'elcorteingles.es',
    url: 'https://www.elcorteingles.es/search/?v=Papeler%C3%ADa&s={searchTerms}&stype=text_box',
    loadedSelector: 'li.products_list-item',
    noResultsXPath: '//div[@class="products_list-container _no_products vp"] | //html[not(//div[@id="products-list"]/ul/li)]',
    zipcode: '',
  },
};
