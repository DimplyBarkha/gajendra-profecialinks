
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'KZ',
    store: 'technodom',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main.CategoryPage',
    loadedXpath: null,
    noResultsXPath: '//div[@class="r46t__results__title__wrap"]/div[@id="r46t-count"]/span[text()=0]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'technodom.kz',
    zipcode: '',
  },
};
