
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'next',
    domain: 'next.co.uk',
    url: 'https://www.next.co.uk/search?w={searchTerms}',
    loadedSelector: 'div[class~="Page"]',
    noResultsXPath: '//div[@class="no-results"]',
    zipcode: '',
  },
};
