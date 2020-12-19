
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AR',
    store: 'falabella',
    domain: 'falabella.com.ar',
    url: 'https://www.falabella.com.ar/falabella-ar/search?Ntt={searchTerms}',
    loadedSelector: 'div[id=testId-searchResults-products]',
    noResultsXPath: "//div[contains(@class,'no-result')] | //section[contains(@class, 'pdp-image-section')]",
    zipcode: '',
  },
};
