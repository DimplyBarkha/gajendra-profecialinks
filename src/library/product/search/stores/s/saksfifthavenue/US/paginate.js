
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    // openSearchDefinition: {
    //   template: 'https://www.saksfifthavenue.com/{query}&start={index}&sz=24',
    //   pageIndexMultiplier: 24,
    //   pageStartNb: 0,
    // },
    openSearchDefinition: null,
    country: 'US',
    store: 'saksfifthavenue',
    // nextLinkSelector: 'p.page-item.next',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'div.spinner',
    loadedSelector: null,
    loadedXpath: '//div[contains(@class, "product-grid")]//div[contains(@class, "col-6")]',
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    domain: 'saksfifthavenue.com',
    zipcode: '',
  },
};
