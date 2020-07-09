
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_deportes',
    domain: 'elcorteingles.es',
    url: 'https://www.elcorteingles.es/deportes/search/?s={searchTerms}',
    loadedSelector: 'ul.product-list>li',
    noResultsXPath: '//div[@class="no-results"]',
    zipcode: '',
  },
};
