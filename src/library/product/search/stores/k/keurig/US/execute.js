
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'keurig',
    domain: 'keurig.com',
    url: 'https://www.keurig.com/search?text={searchTerms}',
    loadedSelector: 'div.top_content img',
    noResultsXPath: '//div[@class="search-result-heading-empty"]',
    zipcode: '',
  },
};
