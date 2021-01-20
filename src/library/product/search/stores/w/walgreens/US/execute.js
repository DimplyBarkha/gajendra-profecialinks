
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'walgreens',
    domain: 'walgreens.com',
    url: 'https://www.walgreens.com/search/results.jsp?Ntt={searchTerms}',
    loadedSelector: 'div.wag-product-card-details',
    noResultsXPath: '//h1[@id="zero-result-alert"]|//div[@id="noProducts-Drug"]|//p[contains(@class, "wag-itemscounttxt")]//strong[text()="0"]',
  },
};
