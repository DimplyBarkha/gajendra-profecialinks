
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'neonet',
    nextLinkSelector: 'div.listingDesktop-pagination_top-173 div * button:last-child',
    noResultsXPath: '//div[@class="noSearchResults-message-WsY"]',
    openSearchDefinition: null,
    domain: 'neonet.pl',
    zipcode: '',
  },
};
