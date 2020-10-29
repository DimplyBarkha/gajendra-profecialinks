
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'reservebar',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.grid--view-items  li:first-child img',
    noResultsXPath: '//div[contains(@id,"category")]//h1',
    openSearchDefinition: null,
    domain: 'reservebar.com',
    zipcode: '',
  },
};
