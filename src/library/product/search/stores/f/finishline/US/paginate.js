
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'finishline',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.finishline.com/store/_/N-/Ntt-{searchTerms}?isrfk=true#?No={page}',
    },
    // openSearchDefinition: ,
    domain: 'finishline.com',
    zipcode: '',
  },
};
