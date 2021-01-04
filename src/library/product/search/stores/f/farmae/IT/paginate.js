
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'IT',
    store: 'farmae',
    nextLinkSelector: 'div.toolbar-bottom div.pages>ol>li:last-child>a.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//p[@class="note-msg" and contains(.,"Non ci sono prodotti corrispondenti alla selezione")]',
    openSearchDefinition: null,
    domain: 'farmae.it',
    zipcode: '',
  },
};
