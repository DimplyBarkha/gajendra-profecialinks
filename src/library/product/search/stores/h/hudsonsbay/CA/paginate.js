
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'hudsonsbay',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.product.bfx-disable-product.standard',
    noResultsXPath: '//span[contains(text(), "weren’t able to find any results")]',
    openSearchDefinition: null,
    domain: 'thebay.com',
    zipcode: '',
  },
};
