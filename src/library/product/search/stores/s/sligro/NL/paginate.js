
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'NL',
    store: 'sligro',
    nextLinkSelector: 'div.cmp-productoverview-pages-bottom-loadmore a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'div.cmp-productoverview-pages-bottom-icon',
    loadedSelector: 'div.search div.cmp-productoverview-product',
    loadedXpath: null,
    noResultsXPath: '//div[@class="cmp-search-notfound"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'sligro.nl',
    zipcode: "''",
  },
};
