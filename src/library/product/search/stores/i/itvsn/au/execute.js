
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'itvsn',
    domain: 'itvsn.com.au',
    url: 'https://www.itvsn.com.au/search/{searchTerms}',
    loadedSelector: 'div.tvsn-category-list',
    noResultsXPath: '//div[contains(@class,"row tvsn-category-list")]//div[contains(@class,"tvsn-category-empty")]',
    zipcode: '',
  },
};
