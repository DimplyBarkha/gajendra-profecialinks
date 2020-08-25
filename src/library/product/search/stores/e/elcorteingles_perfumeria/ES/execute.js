module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_perfumeria',
    domain: 'elcorteingles.es',
    url: 'https://www.elcorteingles.es/perfumeria/search/?s={searchTerms}',
    loadedSelector: 'img.js_preview_image.lazyloaded',
    noResultsXPath: '//div[@class="products_list-container _no_products vp"] | //html[not(//div[@id="products-list"]/ul/li)]',
    zipcode: '',
  },
};
