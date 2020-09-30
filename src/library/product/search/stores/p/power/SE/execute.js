
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'power',
    domain: 'power.se',
    url: 'https://www.power.se/search/?q={searchTerms}',
    loadedSelector: 'div#product-section',
    noResultsXPath: '//span[@class="total-qty" and text()=" 0"]',
    zipcode: '',
  },
};
