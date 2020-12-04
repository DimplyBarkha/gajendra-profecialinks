
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'bloomingdales',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="sortableGrid"]',
    noResultsXPath: '//div[@class="zeroResultsSearchMessage"]',
    openSearchDefinition: null,
    domain: 'bloomingdales.com',
    zipcode: '',
  },
};
