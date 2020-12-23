
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'apotal',
    nextLinkSelector: '.topNavigation .displayPagination ul.page-lst li:last-child a',
    mutationSelector: null, // '#searchList .boxContent_middle h2',
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '#searchList span.text',
    openSearchDefinition: null,
    domain: 'apotal.de',
    zipcode: '',
  },
};
