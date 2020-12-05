
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'MX',
    store: 'farmaciasanpablo',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="product-facet"]',
    loadedXpath: null,
    noResultsXPath: '//div[@class="yCmsContentSlot searchEmptyPageMiddle"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.farmaciasanpablo.com.mx/search?q={searchTerms}&page={page}',
    },
    domain: 'farmaciasanpablo.com.mx',
    zipcode: "''",
  },
};
