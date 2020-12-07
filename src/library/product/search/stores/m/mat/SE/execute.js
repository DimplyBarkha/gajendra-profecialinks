
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'mat',
    domain: 'mat.se',
    url: 'https://www.mat.se/search.html?q={searchTerms}',
    loadedSelector: 'div[class="topProductList ng-isolate-scope"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
