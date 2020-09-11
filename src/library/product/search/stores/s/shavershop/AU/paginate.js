
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'shavershop',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.search-result-content',
    noResultsXPath: 'div.sli_no_results_text',
    openSearchDefinition: {
      template: 'https://www.shavershop.com.au/search?q={searchTerms}&start={page}&sz=32',
    },
    domain: 'shavershop.com.au',
    zipcode: '',
  },
};
