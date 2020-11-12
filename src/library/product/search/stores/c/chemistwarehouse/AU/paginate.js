
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'chemistwarehouse',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.search__result__product__list',
    noResultsXPath: '//div[@class="search__result__products-no-result"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'chemistwarehouse.com.au',
    zipcode: '',
  },
};
