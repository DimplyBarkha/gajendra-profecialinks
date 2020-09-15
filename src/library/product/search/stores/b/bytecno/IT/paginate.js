
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'bytecno',
    nextLinkSelector: 'div.toolbar-bottom a.i-next.icon-caret-right',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'bytecno.it',
    zipcode: '',
  },
};
