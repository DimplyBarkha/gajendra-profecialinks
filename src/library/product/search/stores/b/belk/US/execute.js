
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'belk',
    domain: 'belk.com',
    url: 'https://www.belk.com/search/?q={searchTerms}&lang=default',
    loadedSelector: 'li[class="current-page"]',
    noResultsXPath: '//h1[@class="search-result-data"]',
    zipcode: '',
  },
};
