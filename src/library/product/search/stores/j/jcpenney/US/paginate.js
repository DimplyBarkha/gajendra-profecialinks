
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'jcpenney',
    mutationSelector: null,
    spinnerSelector: null,
    nextLinkSelector: 'button[data-automation-id="product-pagination-right"]>svg',
    loadedSelector: 'div[class*="galleryPointCross"]',
    noResultsXPath: '//h2[contains(text(),"Sorry, no products")]',
    openSearchDefinition: null,
    domain: 'jcpenney.com',
  },
};