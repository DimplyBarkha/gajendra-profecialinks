
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    domain: 'bol.com',
    loadedSelector: 'div[class="product_page_two-column"], div[class="results-area"]',
    noResultsXPath: '//div[@data-test="non-deliverable"]',
    zipcode: '',
  },
};
