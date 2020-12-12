
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'mediamarkt',
    domain: 'mediamarkt.nl',
    url: 'https://www.mediamarkt.nl/nl/search.html?query={searchTerms}&searchProfile=onlineshop&channel=mmnlnl',
    loadedSelector: 'div.product-wrapper',
    noResultsXPath: '//div[contains(@class, "no_search")]|//aside[@id="product-sidebar"]',
    zipcode: '',
  },
};
