
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'fressnapf',
    nextLinkSelector: '.p-item+ .p-item--border',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.grid-item.grid-item--12.grid-item--m--9',
    noResultsXPath: null,
    // openSearchDefinition: {
    //   template: 'https://www.fressnapf.de/search/?currentPage={page}&text={searchTerms}',
    // },
    domain: 'fressnapf.de',
    zipcode: '',
  },
};