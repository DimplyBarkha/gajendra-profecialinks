
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'ES',
    store: 'perfumespremium',
    nextLinkSelector: 'div.search.results > div.toolbar-products:last-child li.item.pages-item-next > a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.products-grid',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'perfumespremium.es',
    zipcode: '',
  },
};
