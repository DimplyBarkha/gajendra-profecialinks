
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CL',
    store: 'jumbo',
    nextLinkSelector: 'button[class*="page-number active"] + button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.shelf-list',
    noResultsXPath: '//div[contains(@class, "error-404-empty-message")]',
    openSearchDefinition: null,
    domain: 'jumbo.cl',
    zipcode: '',
  },
};
