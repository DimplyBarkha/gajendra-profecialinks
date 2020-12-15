
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'staples',
    nextLinkSelector: 'div#Pager > span.scTrack.pager-arrow.next.formLabel',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    // openSearchDefinition: {
    //   offset: 1,
    //   template: 'https://www.staples.co.uk/search?x=0&y=0&keywords=Bakers&page={offset}',
    // },
    domain: 'staples.co.uk',
    zipcode: '',
  },
};
