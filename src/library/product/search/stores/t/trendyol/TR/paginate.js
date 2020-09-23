
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'trendyol',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.srch-prdcts-cntnr img',
    noResultsXPath: '//*[@class="srch-no-rslt"]',
    openSearchDefinition: {
      template: 'https://www.trendyol.com/tum--urunler?q={searchTerms}&pi={page}',
      offset: '24',
    },
    zipcode: '',
    domain: 'trendyol.com',
  },
};
