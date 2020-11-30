
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'RU',
    store: 'dns-shop',
    nextLinkSelector: null, // 'div.opinions-widget__pagination > div > div:nth-child(2) > div > a:nth-child(11)',
    nextLinkXpath: null, // "//a[contains(@class, 'paginator-widget__page') and contains(@data-role, 'next')]",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.opinions-widget',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'dns-shop.ru',
    zipcode: '',
  },
};
