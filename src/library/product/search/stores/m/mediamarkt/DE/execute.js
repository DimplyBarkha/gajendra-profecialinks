
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    domain: 'mediamarkt.de',
    url: 'https://www.mediamarkt.de/de/search.html?&query={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="ZeroResultsView__PageSection-sc-15n7m0l-0 cZToiD"]',
    zipcode: '',
  },
};
