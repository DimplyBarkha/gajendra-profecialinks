
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'PE',
    store: 'Juntoz_Enfabebe',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: '//li[@class="pagination-next ng-scope disabled"]/a',
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://enfabebe.juntoz.com/catalogo?keywords={searchTerms}&allStore=false&specialPrice=false&page={page}',
      },
      pageStartNb: 0,
    domain: 'enfabebe.juntoz.com',
    zipcode: '',
  },
};
