
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'mediamarkt',
    domain: 'mediamarkt.be',
    url: 'https://www.mediamarkt.be/nl/search.html?query={searchTerms}&searchProfile=onlineshop&channel=mmbenl',
    loadedSelector: 'div.product-wrapper',
    noResultsXPath: '//div[@id="search_no_result-top"]',
    zipcode: '',
  },
};
