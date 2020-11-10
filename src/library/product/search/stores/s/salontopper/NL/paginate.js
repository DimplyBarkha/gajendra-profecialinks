
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'salontopper',
    nextLinkSelector: 'ul[class*="pagination"] li:last-child a ',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="product-gallery"]',
    noResultsXPath: '//p[contains(text(), "zijn er geen")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'salontopper.nl',
    zipcode: '',
  },
};
