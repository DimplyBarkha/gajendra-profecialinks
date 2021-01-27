
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'menards',
    domain: 'menards.com',
    url: 'https://www.menards.com/main/search.html?search={searchTerms}',
    loadedSelector: 'div[class="search-item"]',
    noResultsXPath: '//p[@class="mb-0"]',
    zipcode: '',
  },
};
