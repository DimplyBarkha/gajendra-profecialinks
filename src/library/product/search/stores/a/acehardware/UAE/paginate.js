
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UAE',
    store: 'acehardware',
    nextLinkSelector: 'a[class*="pagination__btn--next"]',
    mutationSelector: null,
    spinnerSelector: 'div.b-loader',
    loadedSelector: '//a[contains(@class,"b-product-tile__name")]/span',
    noResultsXPath: '//span[@class="b-noresult-banner__title"]',
    openSearchDefinition: null,
    domain: 'aceuae.com',
    zipcode: '',
  },
};
