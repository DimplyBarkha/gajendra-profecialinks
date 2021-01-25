
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'pacson',
    // nextLinkSelector: 'a[class="pagination__link pagination"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    //  https://pacson.se/sokresultat?q=Handdesinfektion&page=2
    openSearchDefinition: {
      template: 'https://pacson.se/sokresultat?q={searchTerms}&page={page}',
    },
    domain: 'pacson.se',
    zipcode: '',
  },
};
