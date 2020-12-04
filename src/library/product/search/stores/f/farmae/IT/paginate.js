
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IT',
    store: 'farmae',
    nextLinkSelector: 'div.toolbar-bottom div.pages>ol>li:last-child>a.next',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//p[@class="note-msg" and contains(.,"Non ci sono prodotti corrispondenti alla selezione")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'farmae.it',
    zipcode: '',
  },
};
