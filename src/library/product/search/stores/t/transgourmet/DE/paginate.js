
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'transgourmet',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#dataScroller.ui-datascroller.ui-widget',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'transgourmet.de',
    zipcode: "''",
  },
};
