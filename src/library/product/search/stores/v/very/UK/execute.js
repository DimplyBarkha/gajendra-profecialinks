
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'very',
    domain: 'very.co.uk',
    url: 'https://www.very.co.uk/e/q/{searchTerms}.end',
    loadedSelector: 'div[id="products"]',
    noResultsXPath: '//div[@class="standardContent"]',
    zipcode: '',
  },
};
