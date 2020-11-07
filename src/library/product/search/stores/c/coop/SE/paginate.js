
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'coop',
    nextLinkSelector: 'div.Tab-panel.js-tabPanel.is-active  a.Pagination-arrow.js-pageNext',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.Grid-cell',
    noResultsXPath: '//h4[contains(.,"We did not really understand your search")]',
    openSearchDefinition: null,
    domain: 'coop.se',
    zipcode: "''",
  },
};
