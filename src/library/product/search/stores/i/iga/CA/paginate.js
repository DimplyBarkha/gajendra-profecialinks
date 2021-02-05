
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: '(//li[@class="pagination__arrow pagination__arrow--right"]/a)[2]',
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.iga.net/fr/search?t=%7bD9CE4CBE-C8C3-4203-A58B-7CF7B830880E%7d&k={searchTerms}&page={page}&pageSize=20',
      },
    domain: 'iga.net',
    zipcode: '',
  },
};
