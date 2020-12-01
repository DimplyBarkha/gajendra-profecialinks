
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'very',
    nextLinkSelector: 'a[class="paginationNext"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="products"]',
    noResultsXPath: '//div[@class="standardContent"]',
    openSearchDefinition: null,
    domain: 'very.co.uk',
    zipcode: '',
  },
};
