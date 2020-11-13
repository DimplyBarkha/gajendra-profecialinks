
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'jbhifi',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#quicksearch-search-results div.ais-hits--item',
    loadedXpath: null,
    noResultsXPath: '//div[@id="MainContent_products_jbProductListNoResults_noResult"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'jbhifi.com.au',
    zipcode: "''",
  },
};
