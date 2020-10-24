
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'fragrancedirect',
    domain: 'fragrancedirect.co.uk',
    url: 'https://www.fragrancedirect.co.uk/search?q={searchTerms}',
    // loadedSelector: 'div.search-result-content',
    loadedSelector: 'div.product-tile',
    noResultsXPath: '//p[@class="sorry-msg"]',
    zipcode: '',
  },
};
