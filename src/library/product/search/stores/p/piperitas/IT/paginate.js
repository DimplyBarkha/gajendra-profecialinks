
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'piperitas',
    nextLinkSelector: 'div.toolbar-bottom div.pages > ol > li > a[class="next i-next"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="page-title"]',
    loadedXpath: null,
    noResultsXPath: '//p[@class="note-msg"][contains(text(), "Ci spiace, non ci sono prodotti per ora.")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'piperitas.com',
    zipcode: '',
  },
};
