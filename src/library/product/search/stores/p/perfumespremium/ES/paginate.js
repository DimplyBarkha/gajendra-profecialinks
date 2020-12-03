
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
    noResultsXPath: '//div[@class="message notice"]/div[contains(text(), "La búsqueda no ha devuelto ningún resultado.")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'perfumespremium.es',
    zipcode: '',
  },
};
