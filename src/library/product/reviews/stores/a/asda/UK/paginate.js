
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
    dateSelector: 'div[class="pdp-description-reviews__submitted-date"]',
    loadedSelector: 'main.product-detail-page.layout__main',
    loadedXpath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'asda.com',
    zipcode: "''",
  },
};
