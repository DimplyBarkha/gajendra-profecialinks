
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'drakes',
    domain: 'drakes.com.au',
    url: 'https://062.drakes.com.au/search?utf8=%E2%9C%93&q={searchTerms}',
    loadedXpath: '//div[@class="shopping-list search_results"]',
    noResultsXPath: '//div[@class="search-results__empty-message"]//p[text()="No results found"]',
    zipcode: '',
  },
};
