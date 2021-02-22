module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'mediamarkt',
    domain: 'mediamarkt.se',
    url: 'https://www.mediamarkt.se/sv/search.html?query=%27{searchTerms}%27',
    loadedSelector: 'ul[class="products-list"]',
    noResultsXPath: '//*[@class="no-result"]',
    zipcode: '',
  },
};
