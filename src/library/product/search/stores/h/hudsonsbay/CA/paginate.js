
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'hudsonsbay',
    nextLinkSelector: 'p.page-item.d-flex.next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.product.bfx-disable-product.standard',
    noResultsXPath: '//span[contains(text(), "weren’t able to find any results")]',
    openSearchDefinition: {
      offset: 24,
      template: 'https://www.thebay.com/search?q={searchTerms}&lang=en_CA&start={offset}&sz=24',
    },
    domain: 'thebay.com',
    zipcode: '',
  },
};
