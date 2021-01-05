
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'GR',
    store: 'mymarket',
    nextLinkSelector: 'a[rel="next"]:not([class="disabled"])',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.views-row--product-teaser.views-row',
    noResultsXPath: '//div[@class="findastic-no-results"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mymarket.gr',
    zipcode: '',
  },
};
