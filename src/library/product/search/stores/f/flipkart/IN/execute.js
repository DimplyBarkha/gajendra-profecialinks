
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    domain: 'flipkart.com',
    url: 'https://www.flipkart.com/search?q={searchTerms}',
    loadedSelector: 'html body',
    noResultsXPath: '//div[@class="DUFPUZ"]',
    zipcode: '',
  },
};
