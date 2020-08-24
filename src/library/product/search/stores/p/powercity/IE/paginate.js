
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'powercity',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#product-list',
    noResultsXPath: '//div[@class="site-error"]',
    openSearchDefinition: null,
    domain: 'powercity.ie',
    zipcode: '',
  },
};
