
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ZA',
    store: 'woolworths',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product--image img',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class,"grid product-list__srp-info")]//span',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'woolworths.co.za',
    zipcode: '',
  },
};
