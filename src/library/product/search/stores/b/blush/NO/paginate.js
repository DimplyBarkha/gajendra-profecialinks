
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NO',
    store: 'blush',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'form.product-list',
    noResultsXPath: '//div[@class="responsive-content-wrapper"]//div[@class="alert-content"]',
    openSearchDefinition: null,
    domain: 'blush.no',
    zipcode: '',
  },
};
