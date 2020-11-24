
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'dermstore',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: "div[id*='prodGrid'] div[class*='prod-widget-responsive']",
    // noResultsXPath: "//h1//strong[starts-with(text(), '0 product results for')]",
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'dermstore.com',
    zipcode: '',
  },
};
