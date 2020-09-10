
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'kogan',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section._1rmYJ',
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.kogan.com/au/shop/?q={searchTerms}&page={page}',
    },
    domain: 'kogan.com',
    zipcode: '',
    
  },
};
