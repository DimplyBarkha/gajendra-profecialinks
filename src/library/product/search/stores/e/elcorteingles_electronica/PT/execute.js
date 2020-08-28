
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PT',
    store: 'elcorteingles_electronica',
    domain: 'elcorteingles.es',
    url: 'https://beta.elcorteingles.pt/search/?s={searchTerms}',
    loadedSelector: 'ul.c12.products_list._four',
    noResultsXPath: '//div[@class="products_list-container _no_products vp"] | //a[@class="product_detail-brand"]',
    zipcode: '',
  },
};
