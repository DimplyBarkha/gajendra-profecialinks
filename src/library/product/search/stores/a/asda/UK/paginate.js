
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    nextLinkSelector: 'button[aria-label="next page"] > span:not(.asda-icon--gray)',
    spinnerSelector: 'div.search-page-content div.asda-spinner',
    mutationSelector: null,
    loadedSelector: null,
    openSearchDefinition: null,
    domain: 'groceries.asda.com',
  },
};
