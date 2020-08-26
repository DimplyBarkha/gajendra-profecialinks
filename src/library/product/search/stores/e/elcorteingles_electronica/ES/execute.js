
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_electronica',
    domain: 'elcorteingles.es',
    url: "https://www.elcorteingles.es/search/1/?s={searchTerms}",
    loadedSelector: '#products-list  ul li img',
    noResultsXPath: '//div[@id="main-content"]//div[@class="error"]',
    zipcode: '',
  },
};
