
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'shop-apotheke',
    nextLinkSelector: null,
    nextLinkXpath: '//button[@data-qa-id="form-pagination-control-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#algolia-instant-search',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class,"l-grid") and contains(@class,"u-margin--bottom")]//p[contains(text(),"Leider konnten wir keine passenden Produkte zu")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'shop-apotheke.com',
    zipcode: '',
  },
};
