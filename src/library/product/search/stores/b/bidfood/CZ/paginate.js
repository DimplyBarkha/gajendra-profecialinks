
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CZ',
    store: 'bidfood',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#myDivInner',
    noResultsXPath: '//span[@id="ContentPlaceHolder1_InventorySearchResultIndicator_NotFoundLabel" and text()="Hledaný text nebyl nalezen."]/@class',
    openSearchDefinition: null,
    domain: 'mujbidfood.cz',
    zipcode: '',
  },
};