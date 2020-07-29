
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_deportes',
    domain: 'elcorteingles.es',
    url: 'https://beta.elcorteingles.es/deportes/search/?v=Deportes&s={searchTerms}&stype=text_box',
    loadedSelector: 'img.js_preview_image.lazyloaded',
    noResultsXPath: '//div[@class="products_list-container _no_products vp"] | //html[not(//div[@id="products-list"]/ul/li)]',
    zipcode: '',
  },
};
