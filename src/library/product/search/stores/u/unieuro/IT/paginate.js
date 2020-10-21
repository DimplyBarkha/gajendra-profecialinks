
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#instant-results div.items-container img',
    noResultsXPath: '//div[@id="no-results-message"] | //section[@data-module="compare"][not(section)]',
    openSearchDefinition: {
      pageOffset: -1,
      template: 'https://www.unieuro.it/online/?q={searchTerms}&p={page}',
    },
    domain: 'unieuro.it',
    zipcode: '',
  },
};
