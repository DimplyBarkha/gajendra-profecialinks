
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'salontopper',
    nextLinkSelector: 'ul[class*="pagination"] li:last-child a ',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="product-gallery"]',
    noResultsXPath: '//div[contains(@class, "bnr-text")] | //p[contains(text(), "zijn er geen")] | //div[@itemscope][contains(@itemtype, "Product")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'salontopper.nl',
    zipcode: '',
  },
};
