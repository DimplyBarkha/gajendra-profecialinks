
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'surlatable',
    domain: 'surlatable.com',
    url: 'https://www.surlatable.com/search?q={searchTerms}&prefn1=productType&prefv1=HardGood',
    loadedSelector: '#primary',
    noResultsXPath: '//*[@id="primary"]//div[@class="no-hits-result-header"]',
    zipcode: '',
  },
};
