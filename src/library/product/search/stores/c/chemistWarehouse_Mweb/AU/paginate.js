
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'chemistWarehouse_Mweb',
    nextLinkSelector: null,
    // nextLinkXpath: 'div[@class="search__result__products row"]/following-sibling::div[@class="search__result__pager row"][1]//div[contains(@class, "search__result__pager-list")]//button[@class="search__result__pager-button--active search__result__pager-button"]/following-sibling::button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.search__result__product__list',
    noResultsXPath: '//div[contains(@class,"search-results-category-list--empty")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'chemistwarehouse.com.au',
    zipcode: '',
  },
};
