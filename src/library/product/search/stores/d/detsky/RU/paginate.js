
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'RU',
    store: 'detsky',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//*[@id="app-container"]/div[2]/div[1]/main/div/div[2]/div/div/ul/li',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition:
    {
      template: 'https://www.detmir.ru/search/results/page/{page}/?qt={searchTerms}&searchType=common',
    },
    domain: 'detmir.ru',
    zipcode: '',
  },
};
