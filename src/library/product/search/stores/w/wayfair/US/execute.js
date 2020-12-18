
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    domain: 'wayfair.com',
    url: 'https://www.wayfair.com/keyword.php?keyword={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//h2[@class="NoResults-title"]',
    zipcode: '',
  },
};
