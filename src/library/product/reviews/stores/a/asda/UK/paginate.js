
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'asda',
    nextLinkSelector: null, // 'button[data-auto-id="btnright"]',
    nextPageUrlSelector: null,
    nextLinkXpath: null, // '//button[@data-auto-id="btnright"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main.product-detail-page.layout__main',
    loadedXpath: null,
    noResultsXPath: '//section[@class="layout__section page-not-found-layout__section"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'asda.com',
    zipcode: "''",
  },
};
