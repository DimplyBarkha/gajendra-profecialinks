
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'salontopper',
    nextLinkSelector: 'ul[class*="pagination"] li:last-child a ',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="product-gallery"]',
    noResultsXPath: '//p[contains(text(), "zijn er geen")] | //div[@itemscope][contains(@itemtype, "Product")] | //p[contains(text(), "zijn er geen")] | //h1[contains(text(), "Helaas!")] | //p[contains(text(), "zijn er geen")] | //div[@itemscope][contains(@itemtype, "Product")] | //p[contains(text(), "zijn er geen")] | //h1[contains(text(), "Helaas!")] | //div[contains(@class, "bnr-text")][contains(text(), "HAARVERZORGING")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'salontopper.nl',
    zipcode: '',
  },
};
