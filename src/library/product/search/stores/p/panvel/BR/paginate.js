
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    // template: null,
    country: 'BR',
    store: 'panvel',
    nextLinkSelector: 'ul.pagination__list li:last-child a',
    loadedSelector: 'div.search-result__products>div',
    noResultsXPath: '//div[@class="search-result--empty"]/div[contains(.,"Nenhum produto encontrado para o termo pesquisado!")]',
    // nextLinkXpath: null,
    // mutationSelector: null,
    // spinnerSelector: null,
    // loadedXpath: null,
    // noResultsXPath: null,
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    // openSearchDefinition: null,
    domain: 'panvel.com',
    zipcode: '',
  },
};
