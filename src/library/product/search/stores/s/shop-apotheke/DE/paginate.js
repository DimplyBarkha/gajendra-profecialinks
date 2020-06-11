module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'li[data-qa-id="results-per-page-select"]',
    openSearchDefinition: {
      template: 'https://www.shop-apotheke.com/search.htm?&query={searchTerms}&pageNumber={page}',
    },
    domain: 'shop-apotheke.com',
  },
};
