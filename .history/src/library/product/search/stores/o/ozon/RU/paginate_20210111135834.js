module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'RU',
    store: 'ozon',
    nextLinkSelector: '.ui-k6',
    nextLinkXpath: '//a[@class="ui-k6"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ao4',
    loadedXpath: null,
    noResultsXPath: '//div[@class="b6q3"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    // openSearchDefinition: {
    //   template: 'https://www.ozon.ru/search/?from_global=true&page={page}&text={searchTerms}',
    //   pageStartNb: 1,
    // },
    domain: 'ozon.ru',
    zipcode: '',
  },
};
