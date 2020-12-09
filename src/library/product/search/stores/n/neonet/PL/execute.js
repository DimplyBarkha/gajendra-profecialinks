module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'neonet',
    domain: 'neonet.pl',
    url: 'https://www.neonet.pl/search.html?order=score&query={searchTerms}',
    loadedSelector: 'section.listingDesktop-gallery-3uP',
    noResultsXPath: '//div[@class="noSearchResults-message-WsY"]',
    zipcode: '',
    mergeType: 'MERGE_ROWS',
  },
};
