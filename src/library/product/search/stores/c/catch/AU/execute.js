
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'catch',
    domain: 'catch.com.au',
    url: 'https://www.catch.com.au/search?query={searchTerms}',
    //loadedSelector: 'div.grid-row product-flex',
    noResultsXPath: '//div[@class="css-q8itik"]',
    zipcode: '',
  },
};
