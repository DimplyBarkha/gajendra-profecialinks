
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt',
    domain: 'mediamarkt.ch',
    url: 'https://www.mediamarkt.ch/de/search.html?query={searchTerms}&searchProfile=onlineshop&channel=mmchde',
    loadedSelector: 'div.product-wrapper',
    noResultsXPath: '//div[@id="search_no_result-top"]',
    zipcode: '',
  },
};
