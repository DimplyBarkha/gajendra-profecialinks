module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'gracobaby',
    nextLinkSelector: 'button[class="btn btn-tertiary col-12 col-sm-4"]',
    mutationSelector: 'div[class="row grid-header m-0 mt-3"]>div>p>span>span',
    spinnerSelector: null,
    loadedSelector: 'div[class="tab-content col-12 p-0"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'gracobaby.com',
    zipcode: '',
  },
};
