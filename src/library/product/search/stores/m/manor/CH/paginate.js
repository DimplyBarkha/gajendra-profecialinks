
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    nextLinkSelector: 'div.epoq_changepage.m-page-selection-pagination ul.pagination li.pagination-next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#epoq_resultrows_header',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'manor.ch',
    zipcode: "''",
  },
};
