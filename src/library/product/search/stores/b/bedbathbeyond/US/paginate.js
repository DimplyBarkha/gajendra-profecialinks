
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'bedbathbeyond',
    nextLinkSelector: "ul[class *='Pagination_')] li a[class *='__btnNext']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'bedbathbeyond.us',
    zipcode: '',
  },
};
