
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'neonet',
    nextLinkSelector: 'div.listingDesktop-pagination_top-173 div * button:last-child',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section.listingDesktop-gallery-3uP',
    openSearchDefinition: null,
    domain: 'neonet.pl',
    zipcode: '',
  },
};
