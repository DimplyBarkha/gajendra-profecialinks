
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'GR',
    store: 'e-fresh',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedXpath: null,
    loadedSelector: 'div.row.products',
    noResultsXPath: '//div[@class="row products"]/div[contains(@class, "message-box")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.e-fresh.gr/el/search?page={page}&q={searchTerms}',
    },
    domain: 'e-fresh.gr',
    zipcode: "''",
  },
};
