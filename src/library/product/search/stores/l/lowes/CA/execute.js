
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'lowes',
    domain: 'lowes.ca',
    url: 'https://www.lowes.ca/search?query={searchTerms}',
    loadedSelector: 'div[class="tab-products-wrapper"] > ul > li , span[itemprop="name"]',
    noResultsXPath: '//div[@id="products-tab"]//p[contains(@class,"search-results-nothing-found")]',
    zipcode: '',
  },
};
