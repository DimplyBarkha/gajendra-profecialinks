
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'thewhiskyexchange',
    domain: 'thewhiskyexchange.com',
    url: 'https://www.thewhiskyexchange.com/search?q={searchTerms}',
    loadedSelector: 'div.products-grid',
    noResultsXPath: '//p[@class=""]',
    zipcode: '',
  },
};
