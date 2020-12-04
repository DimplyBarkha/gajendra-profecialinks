
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GR',
    store: 'e-fresh',
    domain: 'e-fresh.gr',
    url: 'https://www.e-fresh.gr/el/search?q={searchTerms}',
    loadedSelector: 'div.row.products > div.product',
    noResultsXPath: '//div[@class="message"] | //h6[contains(text(), "Error")]',
    zipcode: '',
  },
};
