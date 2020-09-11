
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'comet',
    domain: 'comet.it',
    url: 'https://www.comet.it/search?iq={searchTerms}',
    loadedSelector: "div[class*='sotto-cat__products__item']",
    noResultsXPath: "//div[contains(@class,'wrap-search-no-result')]",
    zipcode: '',
  },
};
