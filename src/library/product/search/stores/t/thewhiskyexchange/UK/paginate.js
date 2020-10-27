
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'thewhiskyexchange',
    nextLinkSelector: 'div.direction:nth-of-type(3) a.page-link',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.products-grid',
    noResultsXPath: '//p[@class=""]',
    openSearchDefinition: null,
    domain: 'thewhiskyexchange.com',
    zipcode: '',
  },
};
