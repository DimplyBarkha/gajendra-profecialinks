
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
    loadedSelector: '#body-juntoz',
    loadedXpath: null,
    noResultsXPath: '//li[@class="pagination-last ng-scope disabled"]/a',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://enfabebe.juntoz.com/catalogo?keywords={searchTerms}&allStore=false&specialPrice=false&page={page}',
      },
    domain: 'enfabebe.juntoz.com',
    zipcode: '',
  },
};
