
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'frys',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.frys.com/search?sqxts=1&cat=&nearbyStoreName=false&search_type=regular&query_string={searchTerms}&isFSK=true&rows=20&resultpage={page}&start=20&rows=20',
    },
    domain: 'frys.com',
    zipcode: '',
  },
};
