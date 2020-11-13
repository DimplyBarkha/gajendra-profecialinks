
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'petstock',
    domain: 'petstock.com.au',
    url: 'https://www.petstock.com.au/pet/search/{searchTerms}',
    loadedSelector: 'div[class="products"]',
    noResultsXPath: '//div[@class="search-no-result"]',
    zipcode: '',
  },
};
