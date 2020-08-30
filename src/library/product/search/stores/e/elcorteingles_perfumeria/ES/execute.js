
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_perfumeria',
    domain: 'elcorteingles.es',
    url: 'https://www.elcorteingles.es/perfumeria-general/search/1/?v={searchTerms}',
    loadedSelector: 'ul.c12.products_list._four',
    noResultsXPath: '//div[@class="products_list-container _no_products vp"] | //a[@class="product_detail-brand"]',
    zipcode: '',
  },
};
