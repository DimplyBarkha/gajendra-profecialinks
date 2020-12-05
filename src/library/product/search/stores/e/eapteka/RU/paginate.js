
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'RU',
    store: 'eapteka',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section.sec-inner.sec-categories.sec-search',
    loadedXpath: null,
    noResultsXPath: '//div[contains(., "По запросу") and contains(., "ничего не найдено")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.eapteka.ru/search/?q={searchTerms}&PAGEN_1={page}',
    },
    domain: 'eapteka.ru',
    zipcode: "''",
  },
};
