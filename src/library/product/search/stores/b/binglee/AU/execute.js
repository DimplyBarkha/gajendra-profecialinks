
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'binglee',
    domain: 'binglee.com.au',
    url: 'https://www.binglee.com.au/search?q={searchTerms}',
    loadedSelector: 'div.category-view',
    //loadedSelector: 'div.category-products',
    //noResultsXPath: '//div[@id="no-results-container"]',
    zipcode: '',
  },
};
