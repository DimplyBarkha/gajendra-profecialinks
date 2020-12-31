
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NO',
    store: 'power',
    domain: 'power.no',
    url: 'https://www.power.no/search/?q={searchTerms}',
    loadedSelector: 'div#product-section',
    noResultsXPath: '//h2[contains(@class,"product-qty-header")]/span[@class="total-qty" and text()=" 0"]',
    zipcode: '',
  },
};
