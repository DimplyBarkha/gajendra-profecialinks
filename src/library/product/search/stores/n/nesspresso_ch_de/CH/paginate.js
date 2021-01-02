
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'CH',
    store: 'nesspresso_ch_de',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'li.sitemap__element a.sitemap__link',
    loadedXpath: null,
    noResultsXPath: "//*[contains(text(), 'Leider konnten wir die gesuchte')]",
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'nespresso.com',
    zipcode: '',
  },
};
