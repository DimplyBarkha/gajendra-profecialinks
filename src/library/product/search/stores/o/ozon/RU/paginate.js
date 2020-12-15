
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'RU',
    store: 'ozon',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ao4',
    loadedXpath: null,
    noResultsXPath: "//div[@class='b6q3']",
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.ozon.ru/search/?from_global=true&page={page}&text={searchTerms}',
    },
    domain: 'ozon.ru',
    zipcode: '',
  },
};
