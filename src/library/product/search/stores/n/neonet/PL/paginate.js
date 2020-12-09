
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'neonet',
    nextLinkSelector: 'button[class="listingDesktop-showMoreBtn-fyg"]',
    // mutationSelector: '[class="listingDesktop-gallery-3uP"] > div:last-child',
    spinnerSelector: '[class^="styles-loader"]',
    loadedSelector: 'section.listingDesktop-gallery-3uP',
    openSearchDefinition: null,
    domain: 'neonet.pl',
    zipcode: '',
  },
};
