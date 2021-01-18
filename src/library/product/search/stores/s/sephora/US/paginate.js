
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    // nextLinkSelector: 'button[aria-label="Next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '[data-comp*="Paginator"]',
    noResultsXPath: '//*[contains(.,"Sorry, there are no products that match your filter choices.")]',
    openSearchDefinition: {
      template: 'https://www.sephora.com/search?keyword={searchTerms}&currentPage={page}&pageSize=50',
    },
    domain: 'sephora.com',
  },
};
