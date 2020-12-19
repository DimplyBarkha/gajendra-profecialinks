
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'hudsonsbay',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.product.bfx-disable-product.standard',
    noResultsXPath: '//span[contains(text(), "weren’t able to find any results")] | //div[contains(@class, "product-detail product-wrapper")]',
    openSearchDefinition: {
      indexOffset: 0,
      template: 'https://www.thebay.com/search?q={searchTerms}&lang=en_CA&start={offset}&sz=24',
    },
    domain: 'thebay.com',
    zipcode: '',
  },
};
