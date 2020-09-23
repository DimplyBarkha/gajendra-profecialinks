
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_perfumeria',
    domain: 'elcorteingles.es',
    url: 'https://www.elcorteingles.es/perfumeria/search/1/?s={searchTerms}',
    loadedSelector: 'li.products_list-item',
    noResultsXPath: '//div[@class="products_list-container _no_products vp"] | //a[@class="product_detail-brand"]',
    zipcode: '',
  },
};
