
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'GR',
    store: 'ab',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'a[class*="Product"]>img',
    noResultsXPath: '//div[@class="NoSearchResultsMessage"]',
    openSearchDefinition: null,
    zipcode: '',
    domain: 'ab.gr',
  },
};
