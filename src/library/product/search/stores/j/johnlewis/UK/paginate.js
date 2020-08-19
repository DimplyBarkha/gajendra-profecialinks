
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//h1[@class="cms-no-results-heading"]',
    openSearchDefinition: {
      template: 'https://www.johnlewis.com/search?search-term={searchTerms}&page={page}',
    },
    domain: 'johnlewis.com',
    zipcode: '',
  },
};
