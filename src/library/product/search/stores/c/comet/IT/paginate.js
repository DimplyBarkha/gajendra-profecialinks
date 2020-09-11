
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'comet',
    nextLinkSelector: "a[class*='paginator__item__next']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "div[class*='sotto-cat__products__item']",
    noResultsXPath: "//div[contains(@class,'wrap-search-no-result')]",
    openSearchDefinition: null,
    domain: 'comet.it',
    zipcode: '',
  },
};
