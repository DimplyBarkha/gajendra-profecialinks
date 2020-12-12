
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    domain: 'mediamarkt.es',
    url: 'https://www.mediamarkt.es/es/search.html?query={searchTerms}&searchProfile=onlineshop&channel=mmeses',
    loadedSelector: 'div.product-wrapper',
    noResultsXPath: '//div[contains(@id, "search_no_result")]|//div[@id="product-details"]',
    zipcode: '',
  },
};
