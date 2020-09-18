module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'krefel',
    domain: 'krefel.be',
    url: 'https://www.krefel.be/fr/search?q=%27{searchTerms}',
    loadedSelector: 'section[class="products-overview tile"]',
    noResultsXPath: '//div[@class="no-result-content"]//p',
    zipcode: '',
  },
};