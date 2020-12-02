
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'arnotts',
    domain: 'arnotts.ie',
    loadedSelector: 'div#primary',
    noResultsXPath: '//div[@class="error-page-content"]|//span[contains(text(), "404 url not found") and not (//div[@class="error-page-content"])]',
    zipcode: '',
  },
};
