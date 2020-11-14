
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'costco_98188',
    nextLinkSelector: 'div.paging ul li.forward>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.thumbnail span.description',
    noResultsXPath: '//div[@id="no-results"][contains(.,"Try Another Search")]',
    openSearchDefinition: null,
    domain: 'costco.com',
    zipcode: '',
  },
};
