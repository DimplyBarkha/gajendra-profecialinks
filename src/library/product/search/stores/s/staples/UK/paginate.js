
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'staples',
    timeout: 90000,
    nextLinkSelector: 'span[scvalue="pagination: next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="ResultsSection"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'staples.co.uk',
    zipcode: '',
  },
};
