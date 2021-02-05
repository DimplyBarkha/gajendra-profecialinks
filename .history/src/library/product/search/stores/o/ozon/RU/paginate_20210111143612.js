module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'RU',
    store: 'ozon',
    nextLinkSelector: '.b6k6 a.ui-k6',
    nextLinkXpath: '//div[@class="b7t2"]/div[@class="b9i0 ui-k4"]/a[@class="ui-k6"]',
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
