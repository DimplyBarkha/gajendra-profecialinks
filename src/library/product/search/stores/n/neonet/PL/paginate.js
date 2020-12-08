
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'neonet',
    nextLinkSelector: 'button[class="listingDesktop-showMoreBtn-fyg"]',
    mutationSelector: '[class="listingDesktop-gallery-3uP"]',
    spinnerSelector: null,
    // loadedSelector: 'section.listingDesktop-gallery-3uP',
    openSearchDefinition: null,
    domain: 'neonet.pl',
    zipcode: '',
  },
};
