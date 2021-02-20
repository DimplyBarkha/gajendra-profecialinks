
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SV',
    store: 'snusbolaget',
    domain: 'snusbolaget.se',
    url: 'https://www.snusbolaget.se/sok/?q={searchTerms}',
    loadedSelector: 'div[data-placeholder="product-list"]',
    noResultsXPath: '//h1[contains(text(),"Vi hittade")]/span[contains(text(),"0 st")]',
    zipcode: '',
  },
};
