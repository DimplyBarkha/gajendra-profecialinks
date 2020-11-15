
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PT',
    store: 'sweetcare',
    nextLinkSelector: null,
    nextLinkXpath: "//span[contains(@class,'showmore')]",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#searchItems',
    loadedXpath: null,
    noResultsXPath: "//b[contains(text(),'Não encontra o produto')]",
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'sweetcare.pt',
    zipcode: '',
  },
};
